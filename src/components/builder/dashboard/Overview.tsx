'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  Circle,
  Eye,
  FolderKanban,
  Globe2,
  Loader2,
  PenLine,
  Share2,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { formatRelativeTime, profileCompleteness } from '@/lib/site/project';
import type { AnalyticsSummary, SiteProject, StudentProfile } from '@/lib/site/types';
import type { Viewer } from '@/lib/supabase/use-user';
import type { WorkspaceMode } from '@/lib/site/store';
import SitePreview from './SitePreview';
import { Badge, CopyButton, LABEL, ProgressBar, SectionHeader, StatCard, BTN_GHOST, BTN_PRIMARY } from './ui';
import type { ViewKey } from './Shell';

const SUGGESTIONS = [
  'A research portfolio for a biology student applying to STEM programs',
  'A humanities portfolio with essays, debate, and journalism',
  'A studio art portfolio with a gallery and artist statement',
  'A scholar-athlete page for college recruiting',
];

function pathOf(url?: string): string {
  if (!url) return '';
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

export default function Overview({
  projects,
  viewer,
  profile,
  summary,
  mode,
  onCreateFromPrompt,
  onOpenProject,
  onNavigate,
}: {
  projects: SiteProject[];
  viewer: Viewer;
  profile: StudentProfile | null;
  summary: AnalyticsSummary | null;
  mode: WorkspaceMode;
  onCreateFromPrompt: (prompt: string) => Promise<string | null>;
  onOpenProject: (id: string) => void;
  onNavigate: (view: ViewKey) => void;
}) {
  const [prompt, setPrompt] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeness = profileCompleteness(profile);
  const publishedProjects = projects.filter((project) => project.publishedUrl);
  const primary = publishedProjects[0];
  const firstName = viewer.displayName.split(' ')[0] ?? 'there';

  const steps: { label: string; done: boolean; view?: ViewKey; href?: string }[] = [
    { label: 'Create your account', done: Boolean(viewer.user), href: viewer.user ? undefined : '/signup' },
    { label: 'Add profile details', done: completeness >= 45, view: 'settings' },
    { label: 'Build your first portfolio', done: projects.length > 0, view: 'templates' },
    { label: 'Publish and get your link', done: publishedProjects.length > 0, view: 'published' },
  ];
  const completedSteps = steps.filter((step) => step.done).length;
  const progress = Math.round((completedSteps / steps.length) * 100);

  const submit = async (text?: string) => {
    const value = (text ?? prompt).trim();
    if (!value || sending) return;
    setSending(true);
    setError(null);
    try {
      const id = await onCreateFromPrompt(value);
      if (id) setPrompt('');
      else setError('Could not build that site — try again in a moment.');
    } catch {
      setError('Could not build that site — try again in a moment.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10.5px] font-semibold tracking-[0.16em] text-[#7fae93] uppercase">
            {mode === 'cloud' ? 'Cloud workspace' : 'Local workspace'}
          </p>
          <h1 className="mt-2 font-serif text-[28px] leading-tight font-semibold tracking-[-0.025em] sm:text-[32px]">
            Welcome back, {firstName}
          </h1>
          <p className="mt-2 max-w-xl text-[13px] leading-5 text-white/45">
            Build a portfolio that shows what you actually did — then send one link to admissions,
            mentors, and programs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {viewer.username ? (
            <Link href={`/u/${viewer.username}`} className={BTN_GHOST} target="_blank">
              <Eye size={13} /> Public page
            </Link>
          ) : null}
          <button type="button" onClick={() => onNavigate('templates')} className={BTN_PRIMARY}>
            <PenLine size={13} /> New portfolio
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Projects"
          value={projects.length}
          hint={`${projects.length - publishedProjects.length} in draft`}
          icon={<FolderKanban size={15} />}
        />
        <StatCard
          label="Published"
          value={summary?.published ?? publishedProjects.length}
          hint={publishedProjects.length > 0 ? 'Live on the web' : 'Nothing live yet'}
          icon={<Globe2 size={15} />}
        />
        <StatCard
          label="Views · 30 days"
          value={summary ? summary.totalViews.toLocaleString() : viewer.user ? '0' : '—'}
          hint={viewer.user ? 'Across every published site' : 'Sign in to track views'}
          icon={<BarChart3 size={15} />}
        />
        <StatCard
          label="Profile"
          value={`${completeness}%`}
          hint={completeness >= 100 ? 'Everything filled in' : 'Finish it before you share'}
          icon={<UserRound size={15} />}
          accent
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_316px]">
        <div className="space-y-4">
          <section className="relative overflow-hidden rounded-2xl border border-[#6fa384]/20 bg-[#0e1310] p-5 sm:p-6">
            <div
              className="pointer-events-none absolute -top-28 -right-16 h-64 w-64 rounded-full opacity-50 blur-3xl"
              style={{ background: 'radial-gradient(closest-side, #3d6b53, transparent)' }}
            />
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg border border-[#a8d4b8]/20 bg-[#a8d4b8]/10 text-[#a8d4b8]">
                  <Sparkles size={13} />
                </span>
                <p className="text-[11px] font-semibold tracking-[0.13em] text-[#a8d4b8] uppercase">
                  Build with AI
                </p>
              </div>
              <h2 className="mt-3 max-w-lg font-serif text-[22px] leading-snug font-semibold tracking-[-0.02em] sm:text-[25px]">
                Describe your portfolio. Get a complete first draft.
              </h2>
              <p className="mt-2 max-w-lg text-[12.5px] leading-5 text-white/45">
                Sections, copy, and structure — built for academic work, then editable down to the
                last word.
              </p>

              <div className="mt-4 rounded-xl border border-white/[0.08] bg-[#0a0c0b] focus-within:border-[#6fa384]/50">
                <label className={LABEL + ' sr-only'} htmlFor="overview-prompt">
                  Describe your portfolio
                </label>
                <textarea
                  id="overview-prompt"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      void submit();
                    }
                  }}
                  rows={3}
                  placeholder="e.g. A research portfolio for a student who worked in a biology lab and won a science fair award"
                  className="w-full resize-none bg-transparent px-3.5 py-3 text-[13px] leading-5 text-[#f2f1ec] outline-none placeholder:text-white/25"
                />
                <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-3 py-2">
                  <span className="hidden text-[10.5px] text-white/30 sm:inline">
                    Enter to build · Shift + Enter for a new line
                  </span>
                  <button
                    type="button"
                    onClick={() => void submit()}
                    disabled={sending || !prompt.trim()}
                    className={BTN_PRIMARY + ' ml-auto py-1.5'}
                  >
                    {sending ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                    {sending ? 'Building…' : 'Build my portfolio'}
                  </button>
                </div>
              </div>

              {error ? <p className="mt-2 text-[12px] text-red-300/90">{error}</p> : null}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setPrompt(suggestion);
                      void submit(suggestion);
                    }}
                    disabled={sending}
                    className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[11px] text-white/45 transition hover:border-[#6fa384]/40 hover:text-white/80 disabled:opacity-40"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.07] bg-[#101113] p-5">
            <SectionHeader
              title="Continue editing"
              description="Recently updated projects in this workspace."
              action={
                projects.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => onNavigate('projects')}
                    className="inline-flex items-center gap-1 text-[11.5px] font-medium text-white/50 transition hover:text-white"
                  >
                    All projects <ArrowRight size={12} />
                  </button>
                ) : null
              }
            />
            {projects.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-white/[0.09] px-5 py-8 text-center">
                <p className="text-[12.5px] text-white/45">
                  No projects yet. Start with a template or describe one above.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('templates')}
                  className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#a8d4b8] hover:text-[#d3eadb]"
                >
                  Browse templates <ArrowRight size={12} />
                </button>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {projects.slice(0, 3).map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => onOpenProject(project.id)}
                    className="group overflow-hidden rounded-xl border border-white/[0.07] bg-[#0b0c0d] text-left transition hover:border-white/[0.16]"
                  >
                    <SitePreview project={project} className="aspect-[16/10]" />
                    <div className="p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[12px] font-medium text-white/85">
                          {project.title}
                        </p>
                        {project.publishedUrl ? <Badge tone="live">Live</Badge> : <Badge>Draft</Badge>}
                      </div>
                      <p className="mt-1 text-[10.5px] text-white/30">
                        {project.pages.length} page{project.pages.length === 1 ? '' : 's'} ·{' '}
                        {formatRelativeTime(project.updatedAt)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-white/[0.07] bg-[#101113] p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold tracking-[0.1em] text-white/40 uppercase">
                Your portfolio link
              </p>
              <Share2 size={14} className="text-white/25" />
            </div>
            {primary?.publishedUrl ? (
              <>
                <p className="mt-3 text-[12px] leading-5 break-all text-[#cfe5d7]">
                  {pathOf(primary.publishedUrl)}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <CopyButton value={primary.publishedUrl} label="Copy link" />
                  <a
                    href={primary.publishedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-2.5 py-1.5 text-[11.5px] font-medium text-white/60 transition hover:border-white/20 hover:text-white"
                  >
                    <ArrowUpRight size={12} /> Open
                  </a>
                </div>
                <p className="mt-3 border-t border-white/[0.06] pt-3 text-[11px] leading-4 text-white/30">
                  This is the link to put in applications. Keep the URL stable by editing content
                  rather than renaming the site.
                </p>
              </>
            ) : (
              <>
                <p className="mt-3 text-[12px] leading-5 text-white/45">
                  Publish a project and it gets a real address you can share.
                </p>
                <p className="mt-2 rounded-lg bg-white/[0.03] px-2.5 py-2 font-mono text-[11px] text-white/25">
                  /u/{viewer.username ?? 'your-name'}/…
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate(projects.length > 0 ? 'projects' : 'templates')}
                  className={BTN_PRIMARY + ' mt-3 w-full py-2'}
                >
                  <Globe2 size={13} /> {projects.length > 0 ? 'Publish a project' : 'Create a project'}
                </button>
              </>
            )}
          </section>

          <section className="rounded-2xl border border-white/[0.07] bg-[#101113] p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold tracking-[0.1em] text-white/40 uppercase">
                Get set up
              </p>
              <span className="text-[11px] text-white/30">{completedSteps}/{steps.length}</span>
            </div>
            <div className="mt-3">
              <ProgressBar value={progress} />
            </div>
            <ul className="mt-4 space-y-1">
              {steps.map((step) => (
                <li key={step.label}>
                  <button
                    type="button"
                    disabled={step.done}
                    onClick={() => {
                      if (step.href) {
                        window.location.href = step.href;
                        return;
                      }
                      if (step.view) onNavigate(step.view);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-1 py-2 text-left transition enabled:hover:bg-white/[0.03] disabled:cursor-default"
                  >
                    {step.done ? (
                      <span className="grid size-4 place-items-center rounded-full bg-[#a8d4b8]/15 text-[#a8d4b8]">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    ) : (
                      <Circle size={14} className="text-white/20" />
                    )}
                    <span
                      className={`flex-1 text-[12px] ${
                        step.done ? 'text-white/35 line-through' : 'text-white/70'
                      }`}
                    >
                      {step.label}
                    </span>
                    {!step.done ? <ArrowRight size={11} className="text-white/20" /> : null}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/[0.07] bg-[#0d0f10] p-5">
            <p className="text-[11px] font-semibold tracking-[0.1em] text-white/40 uppercase">
              A better portfolio
            </p>
            <ul className="mt-3 space-y-3 text-[11.5px] leading-4.5 text-white/45">
              <li className="flex gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#7fae93]" />
                Lead with outcomes, not adjectives. “Cut analysis time from two days to four hours”
                beats “hard-working”.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#7fae93]" />
                Keep one portfolio per audience. An art school and a research program do not need
                the same first screen.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#7fae93]" />
                Add a real photo. A portrait or work-in-progress image does more than a stock
                graphic.
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
