import { NextRequest, NextResponse } from 'next/server';
import { appOrigin, getAdminClient, getUserFromRequest, getUsername } from '@/lib/supabase/admin';
import { SITE_COLUMNS, projectSlug, rowToProject, type SiteRow } from '@/lib/site/db';
import { slugify, uniqueSlug } from '@/lib/site/project';
import type { SiteProject } from '@/lib/site/types';

export const runtime = 'nodejs';

function invalidProject(project: unknown): project is SiteProject {
  if (!project || typeof project !== 'object') return false;
  const candidate = project as SiteProject;
  return (
    Array.isArray(candidate.pages) &&
    typeof candidate.title === 'string' &&
    typeof candidate.id === 'string' &&
    candidate.id.length > 0
  );
}

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json(
      { projects: [], error: 'Sign in to sync your projects.' },
      { status: 401 }
    );
  }
  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json(
      { projects: [], error: 'Supabase is not configured.' },
      { status: 503 }
    );
  }

  const { data, error } = await admin
    .from('sites')
    .select(SITE_COLUMNS)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    return NextResponse.json(
      { projects: [], error: error.message, code: 'schema_missing' },
      { status: 500 }
    );
  }

  const origin = appOrigin(request);
  return NextResponse.json({
    projects: (data as unknown as SiteRow[]).map((row) => rowToProject(row, origin)),
  });
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Sign in to save to the cloud.' }, { status: 401 });
  }
  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });
  }

  let body: { project?: unknown };
  try {
    body = (await request.json()) as { project?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!invalidProject(body.project)) {
    return NextResponse.json({ error: 'Invalid project' }, { status: 400 });
  }
  const project = body.project;

  const handle =
    (await getUsername(admin, user.id)) ?? slugify(user.email?.split('@')[0] ?? 'student');
  const { data: existing } = await admin.from('sites').select('slug').eq('user_id', user.id);
  const slug = uniqueSlug(
    projectSlug(project),
    ((existing ?? []) as { slug: string }[]).map((row) => row.slug)
  );

  const { error } = await admin.from('sites').upsert({
    id: project.id,
    user_id: user.id,
    owner_username: handle,
    title: project.title,
    description: project.description ?? null,
    slug,
    source: project.source ?? 'elements',
    accent: project.accent ?? '#2f6f4e',
    theme: project.theme ?? { mode: 'light', font: 'sans' },
    pages: project.pages,
    published: false,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message, code: 'schema_missing' }, { status: 500 });
  }

  const { data: saved } = await admin
    .from('sites')
    .select(SITE_COLUMNS)
    .eq('id', project.id)
    .eq('user_id', user.id)
    .maybeSingle();

  return NextResponse.json({
    project: saved ? rowToProject(saved as unknown as SiteRow, appOrigin(request)) : null,
  });
}
