import { NextRequest, NextResponse } from 'next/server';
import { compileProjectIndexHtml } from '@/lib/site/compile';
import { SITE_COLUMNS, projectSlug, rowToProject, type SiteRow } from '@/lib/site/db';
import { newId, slugify, uniqueSlug } from '@/lib/site/project';
import type { SiteProject } from '@/lib/site/types';
import {
  appOrigin,
  getAdminClient,
  getUserFromRequest,
  getUsername,
  isMissingSchema,
} from '@/lib/supabase/admin';

export const runtime = 'nodejs';

const BUCKET = 'sites';

function validProject(value: unknown): value is SiteProject {
  if (!value || typeof value !== 'object') return false;
  const project = value as SiteProject;
  return (
    typeof project.id === 'string' &&
    project.id.length > 0 &&
    typeof project.title === 'string' &&
    Array.isArray(project.pages) &&
    project.pages.length > 0
  );
}

function guestHandle(project: SiteProject): string {
  const existing = project.handle ?? '';
  if (/^guest-[a-z0-9]{6,12}$/.test(existing)) return existing;
  return `guest-${newId()
    .replace(/[^a-z0-9]/gi, '')
    .slice(0, 8)
    .toLowerCase()}`;
}

async function fallbackToStorage(
  project: SiteProject,
  owner: string,
  request: NextRequest
): Promise<NextResponse> {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !secretKey) {
    return NextResponse.json({ error: 'Publishing is not configured.' }, { status: 503 });
  }
  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ error: 'Publishing is not configured.' }, { status: 503 });

  const slug = projectSlug(project);
  const path = `${owner}/${slug}/index.html`;
  const html = compileProjectIndexHtml(project);
  const { error } = await admin.storage
    .from(BUCKET)
    .upload(path, html, { contentType: 'text/html', upsert: true });

  if (error) {
    return NextResponse.json(
      {
        error: `Publishing needs the new database tables. Run supabase/migrations/20261128090000_student_portfolios.sql, then publish again. (${error.message})`,
      },
      { status: 500 }
    );
  }

  const url = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`;
  return NextResponse.json({
    url,
    absoluteUrl: url,
    mode: 'file',
    slug,
    handle: owner,
    origin: appOrigin(request),
  });
}

export async function POST(request: NextRequest) {
  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: 'Publishing is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY.' },
      { status: 503 }
    );
  }

  let body: { project?: unknown };
  try {
    body = (await request.json()) as { project?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!validProject(body.project)) {
    return NextResponse.json({ error: 'Invalid project' }, { status: 400 });
  }
  const project = body.project;
  const user = await getUserFromRequest(request);

  const handle = (
    user
      ? ((await getUsername(admin, user.id)) ?? slugify(user.email?.split('@')[0] ?? 'student'))
      : guestHandle(project)
  ).replace(/[^a-z0-9_-]/gi, '');
  const origin = appOrigin(request);

  const { data: existing, error: readError } = await admin
    .from('sites')
    .select('id,user_id,slug,published_at,owner_username')
    .eq('id', project.id)
    .maybeSingle();

  if (readError) {
    if (isMissingSchema(readError)) return fallbackToStorage(project, handle, request);
    return NextResponse.json({ error: readError.message }, { status: 500 });
  }

  if (existing) {
    const row = existing as { user_id: string | null; slug: string; published_at: string | null };
    if (row.user_id && row.user_id !== user?.id) {
      return NextResponse.json({ error: 'This site belongs to another account.' }, { status: 403 });
    }
  }

  const { data: siblings } = await admin
    .from('sites')
    .select('id,slug')
    .ilike('owner_username', handle)
    .neq('id', project.id);
  const existingSlug = (existing as { slug?: string } | null)?.slug;
  const slug =
    existingSlug ??
    uniqueSlug(
      projectSlug(project),
      ((siblings ?? []) as { slug: string }[]).map((site) => site.slug)
    );

  const { error } = await admin.from('sites').upsert({
    id: project.id,
    user_id: user?.id ?? null,
    owner_username: handle,
    title: project.title,
    description: project.description ?? null,
    slug,
    source: project.source ?? 'elements',
    accent: project.accent ?? '#2f6f4e',
    theme: project.theme ?? { mode: 'light', font: 'sans' },
    pages: project.pages,
    published: true,
    published_at:
      (existing as { published_at?: string | null } | null)?.published_at ??
      new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    if (isMissingSchema(error)) return fallbackToStorage(project, handle, request);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: saved } = await admin
    .from('sites')
    .select(SITE_COLUMNS)
    .eq('id', project.id)
    .maybeSingle();

  const path = `/u/${handle}/${slug}`;
  return NextResponse.json({
    url: path,
    absoluteUrl: `${origin}${path}`,
    mode: 'cloud',
    slug,
    handle,
    site: saved ? rowToProject(saved as unknown as SiteRow, origin) : null,
  });
}

export async function DELETE(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user)
    return NextResponse.json({ error: 'Sign in to manage published sites.' }, { status: 401 });
  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ error: 'Publishing is not configured.' }, { status: 503 });

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing site id' }, { status: 400 });

  const { error } = await admin
    .from('sites')
    .update({ published: false })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
