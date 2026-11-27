import { NextRequest } from 'next/server';
import { compilePageHtml, type CompileOptions } from '@/lib/site/compile';
import { SITE_COLUMNS, rowToProject, type SiteRow } from '@/lib/site/db';
import { appOrigin, getAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function messagePage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${title} — Folio</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0a0a0b;color:#f5f4ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:24px}
  .card{max-width:440px;width:100%;border:1px solid rgba(255,255,255,.1);background:#121214;border-radius:20px;padding:40px 36px;text-align:center}
  .mark{display:grid;place-items:center;width:38px;height:38px;margin:0 auto 20px;border-radius:11px;background:#2f6f4e;color:#fff;font-weight:700}
  h1{font-size:1.35rem;letter-spacing:-.02em;margin:0 0 10px}
  p{margin:0;color:#a3a19b;font-size:.95rem;line-height:1.65}
  a{display:inline-block;margin-top:24px;color:#f5f4ef;font-size:.9rem;text-decoration:none;border-bottom:1px solid rgba(255,255,255,.25);padding-bottom:3px}
</style>
</head>
<body>
  <div class="card">
    <span class="mark">F</span>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="/">Built with Folio — make your own portfolio</a>
  </div>
</body>
</html>`;
}

const HTML_HEADERS = {
  'content-type': 'text/html; charset=utf-8',
  'x-content-type-options': 'nosniff',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string; slug: string; page?: string[] }> }
) {
  const { username: rawUsername, slug, page } = await params;
  const username = rawUsername.replace(/[%_]/g, '');
  const admin = getAdminClient();

  if (!admin) {
    return new Response(
      messagePage('Not available yet', 'Publishing has not been configured on this deployment.'),
      { status: 503, headers: HTML_HEADERS }
    );
  }

  const { data, error } = await admin
    .from('sites')
    .select(SITE_COLUMNS)
    .eq('owner_username', username)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error || !data) {
    return new Response(
      messagePage(
        'Portfolio not found',
        'This portfolio may have been unpublished, renamed, or never published. Double-check the link you were given.'
      ),
      { status: 404, headers: HTML_HEADERS }
    );
  }

  const project = rowToProject(data as unknown as SiteRow);
  const requested = page?.[0];
  const activePage = requested
    ? project.pages.find((candidate) => candidate.slug === requested)
    : project.pages[0];

  if (!activePage) {
    return new Response(
      messagePage('Page not found', 'That page does not exist on this portfolio.'),
      { status: 404, headers: HTML_HEADERS }
    );
  }

  const options: CompileOptions = {
    basePath: `/u/${username}/${slug}`,
    siteUrl: appOrigin(request),
  };
  const html = compilePageHtml(activePage, project, options);

  const userAgent = request.headers.get('user-agent') ?? '';
  const isBot = /bot|crawl|spider|slurp|preview|headless|facebookexternalhit/i.test(userAgent);
  if (!isBot) {
    try {
      await admin.from('site_views').insert({
        site_id: project.id,
        referrer: (request.headers.get('referer') ?? '').slice(0, 500) || null,
      });
    } catch {
      /* analytics must never break the published page */
    }
  }

  return new Response(html, {
    status: 200,
    headers: {
      ...HTML_HEADERS,
      'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
