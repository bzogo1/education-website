import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient, getUserFromRequest, isMissingSchema } from '@/lib/supabase/admin';
import {
  PROFILE_COLUMNS,
  cleanText,
  rowToProfile,
  sanitizeLinks,
  type ProfileRow,
} from '@/lib/site/db';
import { slugify } from '@/lib/site/project';
import type { StudentProfile } from '@/lib/site/types';

export const runtime = 'nodejs';

function fallbackProfile(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): StudentProfile {
  const meta = user.user_metadata ?? {};
  return {
    username:
      (typeof meta.username === 'string' && meta.username) ||
      slugify(user.email?.split('@')[0] ?? 'student'),
    firstName: typeof meta.first_name === 'string' ? meta.first_name : null,
    lastName: typeof meta.last_name === 'string' ? meta.last_name : null,
    headline: null,
    school: null,
    graduationYear: null,
    location: null,
    bio: null,
    avatarUrl: null,
    links: [],
  };
}

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ profile: null, mode: 'local' }, { status: 401 });
  }
  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ profile: fallbackProfile(user), mode: 'local' });

  const { data, error } = await admin
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({
      profile: fallbackProfile(user),
      mode: 'local',
      error: isMissingSchema(error) ? 'Profile columns are missing.' : error.message,
    });
  }

  if (!data) {
    return NextResponse.json({ profile: fallbackProfile(user), mode: 'cloud' });
  }

  return NextResponse.json({ profile: rowToProfile(data as unknown as ProfileRow), mode: 'cloud' });
}

export async function PATCH(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Sign in to edit your profile.' }, { status: 401 });
  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { error } = await admin
    .from('profiles')
    .update({
      first_name: cleanText(body.firstName, 60),
      last_name: cleanText(body.lastName, 60),
      headline: cleanText(body.headline, 120),
      school: cleanText(body.school, 120),
      graduation_year: cleanText(body.graduationYear, 20),
      location: cleanText(body.location, 80),
      bio: cleanText(body.bio, 1200),
      avatar_url: cleanText(body.avatarUrl, 500),
      links: sanitizeLinks(body.links),
    })
    .eq('id', user.id);

  if (error) {
    return NextResponse.json(
      {
        error: isMissingSchema(error)
          ? 'Run supabase/migrations/20261128090000_student_portfolios.sql to save profile details.'
          : error.message,
      },
      { status: 500 }
    );
  }

  const { data } = await admin
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', user.id)
    .maybeSingle();

  return NextResponse.json({
    profile: data ? rowToProfile(data as unknown as ProfileRow) : fallbackProfile(user),
  });
}
