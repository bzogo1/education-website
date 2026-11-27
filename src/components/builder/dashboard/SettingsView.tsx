'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Check, Loader2, LogIn, Plus, Trash2, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { profileCompleteness } from '@/lib/site/project';
import type { SiteProject, StudentProfile } from '@/lib/site/types';
import type { WorkspaceMode } from '@/lib/site/store';
import type { Viewer } from '@/lib/supabase/use-user';
import { Badge, INPUT, LABEL, ProgressBar, SectionHeader, BTN_GHOST, BTN_PRIMARY } from './ui';

function emptyProfile(username: string, viewerName: string): StudentProfile {
  const [first, ...rest] = viewerName.split(' ');
  return {
    username,
    firstName: first ?? null,
    lastName: rest.join(' ') || null,
    headline: null,
    school: null,
    graduationYear: null,
    location: null,
    bio: null,
    avatarUrl: null,
    links: [],
  };
}

export default function SettingsView({
  viewer,
  profile,
  projects,
  mode,
  loading,
  saving,
  error,
  onSave,
}: {
  viewer: Viewer;
  profile: StudentProfile | null;
  projects: SiteProject[];
  mode: WorkspaceMode;
  loading: boolean;
  saving: boolean;
  error: string | null;
  onSave: (profile: StudentProfile) => Promise<StudentProfile | null>;
}) {
  const [form, setForm] = useState<StudentProfile>(() =>
    emptyProfile(viewer.username ?? 'student', viewer.displayName)
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setForm(profile);
    else if (viewer.username) setForm(emptyProfile(viewer.username, viewer.displayName));
  }, [profile, viewer.username, viewer.displayName]);

  const completeness = useMemo(() => profileCompleteness(form), [form]);
  const fullName = `${form.firstName ?? ''} ${form.lastName ?? ''}`.trim() || form.username;
  const published = projects.filter((project) => project.publishedUrl);

  const update = (patch: Partial<StudentProfile>) => {
    setSaved(false);
    setForm((current) => ({ ...current, ...patch }));
  };

  const submit = async () => {
    const result = await onSave(form);
    if (result) {
      setSaved(true);
      toast.success('Profile saved');
      setTimeout(() => setSaved(false), 2600);
    } else {
      toast.error('Could not save your profile');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-[28px] leading-tight font-semibold tracking-[-0.025em]">
          Settings
        </h1>
        <p className="mt-1.5 text-[13px] text-white/45">
          Your profile powers the public page at /u/{form.username}. Admissions teams see this
          before they open a single portfolio.
        </p>
      </div>

      {!viewer.user ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#6fa384]/25 bg-[#0e1310] px-4 py-3">
          <div>
            <p className="text-[12.5px] font-medium text-[#d3eadb]">You are in a guest workspace</p>
            <p className="mt-0.5 text-[11.5px] text-white/40">
              Create an account to save your profile, sync projects across devices, and get a public
              URL.
            </p>
          </div>
          <Link href="/signup" className={BTN_PRIMARY}>
            <LogIn size={13} /> Create account
          </Link>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2 text-[12px] text-amber-100/80">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-white/[0.07] bg-[#101113] p-5">
            <SectionHeader
              title="Profile"
              description="Shown on your public page and in every portfolio you share."
            />

            <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="first-name" className={LABEL}>
                  First name
                </label>
                <input
                  id="first-name"
                  value={form.firstName ?? ''}
                  onChange={(event) => update({ firstName: event.target.value })}
                  placeholder="Maya"
                  className={INPUT}
                />
              </div>
              <div>
                <label htmlFor="last-name" className={LABEL}>
                  Last name
                </label>
                <input
                  id="last-name"
                  value={form.lastName ?? ''}
                  onChange={(event) => update({ lastName: event.target.value })}
                  placeholder="Chen"
                  className={INPUT}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="headline" className={LABEL}>
                  Headline
                </label>
                <input
                  id="headline"
                  value={form.headline ?? ''}
                  onChange={(event) => update({ headline: event.target.value })}
                  placeholder="Computational biology student · Class of 2027"
                  className={INPUT}
                />
                <p className="mt-1 text-[10.5px] text-white/25">
                  One line that explains what you study and what you are looking for.
                </p>
              </div>
              <div>
                <label htmlFor="school" className={LABEL}>
                  School
                </label>
                <input
                  id="school"
                  value={form.school ?? ''}
                  onChange={(event) => update({ school: event.target.value })}
                  placeholder="Lincoln High School"
                  className={INPUT}
                />
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="grad-year" className={LABEL}>
                    Graduating
                  </label>
                  <input
                    id="grad-year"
                    value={form.graduationYear ?? ''}
                    onChange={(event) => update({ graduationYear: event.target.value })}
                    placeholder="2027"
                    className={INPUT}
                  />
                </div>
                <div>
                  <label htmlFor="location" className={LABEL}>
                    Location
                  </label>
                  <input
                    id="location"
                    value={form.location ?? ''}
                    onChange={(event) => update({ location: event.target.value })}
                    placeholder="Portland, OR"
                    className={INPUT}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="bio" className={LABEL}>
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={form.bio ?? ''}
                  onChange={(event) => update({ bio: event.target.value })}
                  rows={4}
                  placeholder="Two or three sentences about your work and what you care about. Write it the way you would say it."
                  className={INPUT + ' resize-y leading-5'}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="avatar" className={LABEL}>
                  Portrait URL
                </label>
                <input
                  id="avatar"
                  value={form.avatarUrl ?? ''}
                  onChange={(event) => update({ avatarUrl: event.target.value })}
                  placeholder="https://…/portrait.jpg"
                  className={INPUT}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.07] bg-[#101113] p-5">
            <SectionHeader
              title="Links"
              description="Up to eight links — GitHub, LinkedIn, a research page, a school newspaper."
            />
            <div className="mt-4 space-y-2">
              {form.links.length === 0 ? (
                <p className="rounded-lg border border-dashed border-white/[0.08] px-3 py-4 text-center text-[11.5px] text-white/30">
                  No links yet.
                </p>
              ) : (
                form.links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      value={link.label}
                      onChange={(event) => {
                        const links = form.links.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, label: event.target.value } : item
                        );
                        update({ links });
                      }}
                      placeholder="Label"
                      aria-label={`Link ${index + 1} label`}
                      className={INPUT + ' max-w-[150px] py-2'}
                    />
                    <input
                      value={link.url}
                      onChange={(event) => {
                        const links = form.links.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, url: event.target.value } : item
                        );
                        update({ links });
                      }}
                      placeholder="https://…"
                      aria-label={`Link ${index + 1} URL`}
                      className={INPUT + ' py-2'}
                    />
                    <button
                      type="button"
                      onClick={() => update({ links: form.links.filter((_, i) => i !== index) })}
                      aria-label="Remove link"
                      className="grid size-8 shrink-0 place-items-center rounded-lg text-white/30 transition hover:bg-red-400/10 hover:text-red-300"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
              {form.links.length < 8 ? (
                <button
                  type="button"
                  onClick={() => update({ links: [...form.links, { label: '', url: '' }] })}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/[0.12] px-2.5 py-1.5 text-[11px] text-white/45 transition hover:border-white/25 hover:text-white/80"
                >
                  <Plus size={11} /> Add link
                </button>
              ) : null}
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void submit()}
              disabled={saving || loading || !viewer.user}
              className={BTN_PRIMARY}
            >
              {saving ? (
                <Loader2 size={13} className="animate-spin" />
              ) : saved ? (
                <Check size={13} />
              ) : null}
              {saving ? 'Saving…' : saved ? 'Saved' : 'Save profile'}
            </button>
            {!viewer.user ? (
              <span className="text-[11px] text-white/30">Sign in to save changes.</span>
            ) : (
              <span className="text-[11px] text-white/30">
                {mode === 'cloud' ? 'Saved to your account' : 'Local workspace'}
              </span>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-white/[0.07] bg-[#101113] p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold tracking-[0.1em] text-white/40 uppercase">
                Public page
              </p>
              <Badge tone={completeness >= 70 ? 'live' : 'warn'}>{completeness}% complete</Badge>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#1d2a22] text-[13px] font-semibold text-[#bfe0cb]">
                {(form.firstName?.[0] ?? '') + (form.lastName?.[0] ?? '') || 'S'}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-white/85">{fullName}</p>
                <p className="truncate text-[11px] text-white/35">
                  {form.headline || 'Add a headline'}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <ProgressBar value={completeness} />
            </div>
            <p className="mt-3 text-[10.5px] leading-4 text-white/30">
              {form.school || 'School'}{' '}
              {form.graduationYear ? `· Class of ${form.graduationYear}` : ''}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={`/u/${form.username}`}
                target="_blank"
                className={BTN_GHOST + ' w-full justify-between'}
              >
                /u/{form.username} <ArrowUpRight size={12} />
              </Link>
              <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                <p className="text-[10px] tracking-wide text-white/30 uppercase">Published</p>
                <p className="mt-0.5 text-[12px] text-white/60">
                  {published.length} site{published.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.07] bg-[#0d0f10] p-5">
            <div className="flex items-center gap-2">
              <UserRound size={14} className="text-white/30" />
              <p className="text-[11px] font-semibold tracking-[0.1em] text-white/40 uppercase">
                Account
              </p>
            </div>
            <dl className="mt-3 space-y-2.5 text-[11.5px]">
              <div className="flex justify-between gap-3">
                <dt className="text-white/35">Username</dt>
                <dd className="truncate text-white/70">@{form.username}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-white/35">Email</dt>
                <dd className="truncate text-white/70">{viewer.user?.email ?? 'Not signed in'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-white/35">Workspace</dt>
                <dd className="text-white/70">{mode === 'cloud' ? 'Cloud' : 'This browser'}</dd>
              </div>
            </dl>
            {!viewer.user ? (
              <Link href="/signup" className={BTN_PRIMARY + ' mt-4 w-full'}>
                <LogIn size={13} /> Create an account
              </Link>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  );
}
