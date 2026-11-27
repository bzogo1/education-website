import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PROFILE_COLUMNS, rowToProfile, type ProfileRow } from '@/lib/site/db';
import { getAdminClient } from '@/lib/supabase/admin';
import type { StudentProfile } from '@/lib/site/types';

export const dynamic = 'force-dynamic';

interface PublicSite {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  accent: string;
  updated_at: string;
  owner_username: string;
}

async function loadProfile(username: string): Promise<StudentProfile | null> {
  const admin = getAdminClient();
  if (!admin) return null;
  const { data } = await admin
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('username', username)
    .maybeSingle();
  return data ? rowToProfile(data as unknown as ProfileRow) : null;
}

async function loadSites(username: string): Promise<PublicSite[]> {
  const admin = getAdminClient();
  if (!admin) return [];
  const { data } = await admin
    .from('sites')
    .select('id,title,description,slug,accent,updated_at,owner_username')
    .eq('owner_username', username)
    .eq('published', true)
    .order('published_at', { ascending: false });
  return (data ?? []) as PublicSite[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const [profile, sites] = await Promise.all([loadProfile(username), loadSites(username)]);
  if (!profile && sites.length === 0) return { title: 'Portfolio not found' };
  const name = profile
    ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || profile.username
    : username;
  const title = `${name} — Student portfolio`;
  const description =
    profile?.headline ??
    profile?.bio?.slice(0, 155) ??
    `${name} on Folio, a portfolio platform for students.`;
  return {
    title,
    description,
    openGraph: { title, description, type: 'profile' },
    twitter: { card: 'summary', title, description },
    robots: username.startsWith('guest-') ? { index: false, follow: false } : undefined,
  };
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'F';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const [profile, sites] = await Promise.all([loadProfile(username), loadSites(username)]);
  if (!profile && sites.length === 0) notFound();

  const name = profile
    ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || profile.username
    : username;
  const meta = [profile?.school, profile?.graduationYear && `Class of ${profile.graduationYear}`, profile?.location]
    .filter(Boolean)
    .join('  ·  ');

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f5f4ef] antialiased">
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[#08090a]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
            <span className="grid size-8 place-items-center rounded-[10px] bg-[#2f6f4e] text-sm font-bold">
              F
            </span>
            Folio
          </Link>
          <Link
            href="/signup"
            className="rounded-lg border border-white/12 px-3.5 py-2 text-[13px] text-white/80 transition hover:border-white/25 hover:text-white"
          >
            Create your portfolio
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 pt-16 pb-24">
        <section className="flex flex-col gap-7 sm:flex-row sm:items-start">
          <div
            className="grid size-24 shrink-0 place-items-center rounded-[26px] text-2xl font-semibold tracking-wide text-white shadow-[0_20px_50px_-30px_rgba(0,0,0,.9)]"
            style={{ backgroundColor: sites[0]?.accent ?? '#2f6f4e' }}
          >
            {initialsOf(name)}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-[#7fae93] uppercase">
              Student portfolio
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">{name}</h1>
            {profile?.headline ? (
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
                {profile.headline}
              </p>
            ) : null}
            {meta ? <p className="mt-4 text-sm text-white/45">{meta}</p> : null}
            {profile?.bio ? (
              <p className="mt-6 max-w-2xl text-[15px] leading-7 whitespace-pre-line text-white/60">
                {profile.bio}
              </p>
            ) : null}
            {profile?.links?.length ? (
              <div className="mt-7 flex flex-wrap gap-2">
                {profile.links.map((link) => (
                  <a
                    key={`${link.label}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded-full border border-white/12 px-3.5 py-1.5 text-xs text-white/70 transition hover:border-white/30 hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section className="mt-16">
          <div className="flex items-end justify-between gap-4 border-b border-white/8 pb-4">
            <h2 className="text-lg font-semibold tracking-tight">
              {sites.length === 1 ? 'Portfolio' : 'Portfolios'}
            </h2>
            <span className="text-xs text-white/40">
              {sites.length} published
            </span>
          </div>

          {sites.length === 0 ? (
            <p className="py-16 text-center text-sm text-white/45">
              Nothing has been published here yet.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {sites.map((site) => (
                <a
                  key={site.id}
                  href={`/u/${site.owner_username}/${site.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#101113] p-6 transition hover:-translate-y-0.5 hover:border-white/20"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-[3px]"
                    style={{ backgroundColor: site.accent }}
                  />
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-semibold tracking-tight">{site.title}</h3>
                    <span className="text-white/30 transition group-hover:translate-x-0.5 group-hover:text-white/70">
                      ↗
                    </span>
                  </div>
                  {site.description ? (
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/50">
                      {site.description}
                    </p>
                  ) : null}
                  <p className="mt-5 text-[11px] tracking-wide text-white/35">
                    Updated {new Date(site.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-white/8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-8 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>Portfolios for students, built with Folio.</p>
          <Link href="/signup" className="text-white/60 transition hover:text-white">
            Make yours →
          </Link>
        </div>
      </footer>
    </div>
  );
}
