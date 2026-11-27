import { NextRequest, NextResponse } from 'next/server';
import { appOrigin, getAdminClient, getUserFromRequest } from '@/lib/supabase/admin';
import { SITE_COLUMNS, projectSlug, rowToProject, type SiteRow } from '@/lib/site/db';
import { uniqueSlug } from '@/lib/site/project';
import type { SiteProject } from '@/lib/site/types';

export const runtime = 'nodejs';

function isValid(project: unknown): project is SiteProject {
  if (!project || typeof project !== 'object') return false;
  const candidate = project as SiteProject;
  return Array.isArray(candidate.pages) && typeof candidate.title === 'string';
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });

  let body: { project?: unknown };
  try {
    body = (await request.json()) as { project?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!isValid(body.project)) {
    return NextResponse.json({ error: 'Invalid project' }, { status: 400 });
  }
  const project = body.project;

  const { data: current } = await admin
    .from('sites')
    .select('slug,published,owner_username')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!current) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

  const row = current as { slug: string; published: boolean; owner_username: string };
  let slug = row.slug;
  if (!row.published && projectSlug(project) !== row.slug) {
    const { data: others } = await admin
      .from('sites')
      .select('slug')
      .eq('user_id', user.id)
      .neq('id', id);
    slug = uniqueSlug(
      projectSlug(project),
      ((others ?? []) as { slug: string }[]).map((site) => site.slug)
    );
  }

  const { error } = await admin
    .from('sites')
    .update({
      title: project.title,
      description: project.description ?? null,
      slug,
      accent: project.accent ?? '#2f6f4e',
      theme: project.theme ?? { mode: 'light', font: 'sans' },
      pages: project.pages,
      source: project.source ?? 'elements',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: saved } = await admin
    .from('sites')
    .select(SITE_COLUMNS)
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  return NextResponse.json({
    project: saved ? rowToProject(saved as unknown as SiteRow, appOrigin(request)) : null,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });

  const { error } = await admin.from('sites').delete().eq('id', id).eq('user_id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
