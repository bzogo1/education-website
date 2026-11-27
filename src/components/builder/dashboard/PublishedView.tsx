'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, Copy, Eye, Globe2, Link2, Loader2, PenLine, PowerOff } from 'lucide-react';
import { formatRelativeTime } from '@/lib/site/project';
import type { AnalyticsSummary, SiteProject } from '@/lib/site/types';
import { Badge, CopyButton, EmptyState, SectionHeader, BTN_GHOST, BTN_PRIMARY } from './ui';

function pathOf(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

export default function PublishedView({
  projects,
  summary,
  viewerUsername,
  onOpen,
  onUnpublish,
  onBrowseProjects,
}: {
  projects: SiteProject[];
  summary: AnalyticsSummary | null;
  viewerUsername: string | null;
  onOpen: (id: string) => void;
  onUnpublish: (project: SiteProject) => Promise<{ ok: boolean; error?: string }>;
  onBrowseProjects: () => void;
}) {
  const published = projects.filter((project) => project.publishedUrl);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const viewsFor = (id: string) => summary?.sites.find((site) => site.id === id)?.views ?? 0;

  const handleUnpublish = async (project: SiteProject) => {
    setBusyId(project.id);
    setError(null);
    const result = await onUnpublish(project);
    if (!result.ok) setError(result.error ?? 'Could not unpublish this site.');
    setBusyId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[28px] leading-tight font-semibold tracking-[-0.025em]">
            Published
          </h1>
          <p className="mt-1.5 text-[13px] text-white/45">
            These are live on the web. Share the link, or take a site down without losing the
            project.
          </p>
        </div>
        {viewerUsername ? (
          <Link href={`/u/${viewerUsername}`} target="_blank" className={BTN_GHOST}>
            <Eye size={13} /> View public page
          </Link>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.07] bg-[#101113] p-5">
          <p className="text-[11px] tracking-[0.09em] text-white/40 uppercase">Live sites</p>
          <p className="mt-2 font-serif text-[26px] font-semibold">{published.length}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.07] bg-[#101113] p-5">
          <p className="text-[11px] tracking-[0.09em] text-white/40 uppercase">Views · 30 days</p>
          <p className="mt-2 font-serif text-[26px] font-semibold">
            {(summary?.totalViews ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-white/[0.07] bg-[#101113] p-5">
          <p className="text-[11px] tracking-[0.09em] text-white/40 uppercase">Most viewed</p>
          <p className="mt-2 truncate text-[13px] font-medium text-white/75">
            {summary?.sites[0]?.title ?? 'No views yet'}
          </p>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-400/20 bg-red-400/[0.06] px-3 py-2 text-[12px] text-red-200/90">
          {error}
        </p>
      ) : null}

      {published.length === 0 ? (
        <EmptyState
          icon={<Globe2 size={19} />}
          title="Nothing is live yet"
          description="Publishing gives your project a real URL at /u/your-name/slug. You can unpublish at any time — your project stays in the dashboard."
          action={
            <button type="button" onClick={onBrowseProjects} className={BTN_PRIMARY}>
              <PenLine size={13} /> Choose a project to publish
            </button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101113]">
          <div className="hidden items-center gap-3 border-b border-white/[0.06] px-5 py-2.5 text-[10px] font-semibold tracking-[0.1em] text-white/30 uppercase sm:flex">
            <span className="min-w-0 flex-1">Site</span>
            <span className="w-20 text-right">Views</span>
            <span className="w-24 text-right">Actions</span>
          </div>
          <ul className="divide-y divide-white/[0.06]">
            {published.map((project) => (
              <li key={project.id} className="px-4 py-4 sm:px-5">
                <div className="flex items-center gap-3">
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/[0.08] text-[11px] font-semibold"
                    style={{ backgroundColor: `${project.accent}22`, color: project.accent }}
                  >
                    <Link2 size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[12.5px] font-medium text-white/85">
                        {project.title}
                      </p>
                      <Badge tone="live">Live</Badge>
                    </div>
                    <a
                      href={project.publishedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-0.5 inline-flex max-w-full items-center gap-1 text-[11px] text-[#a8d4b8]/80 hover:text-[#d3eadb]"
                    >
                      <span className="truncate">{pathOf(project.publishedUrl!)}</span>
                      <ArrowUpRight size={10} />
                    </a>
                  </div>
                  <div className="hidden w-20 text-right text-[12px] text-white/55 tabular-nums sm:block">
                    {viewsFor(project.id).toLocaleString()}
                  </div>
                  <div className="flex w-auto items-center justify-end gap-1.5 sm:w-24">
                    <CopyButton value={project.publishedUrl!} label="" />
                    <button
                      type="button"
                      onClick={() => void handleUnpublish(project)}
                      disabled={busyId === project.id}
                      title="Unpublish"
                      aria-label="Unpublish"
                      className="grid size-7 place-items-center rounded-lg text-white/35 transition hover:bg-red-400/10 hover:text-red-300 disabled:opacity-40"
                    >
                      {busyId === project.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <PowerOff size={13} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 pl-12 text-[10.5px] text-white/30">
                  <span>
                    Published{' '}
                    {project.publishedAt ? formatRelativeTime(project.publishedAt) : 'recently'}
                  </span>
                  <span>·</span>
                  <span>{project.pages.length} pages</span>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => onOpen(project.id)}
                    className="text-white/45 transition hover:text-white"
                  >
                    Edit project
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-[#0d0f10] p-4">
        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-white/35">
          <Copy size={13} />
        </span>
        <div>
          <SectionHeader
            title="Put one link everywhere"
            description="College applications, email signatures, scholarship forms, and your school’s program portal. The public page at /u/your-name collects everything you have published."
          />
        </div>
      </div>
    </div>
  );
}
