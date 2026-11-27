'use client';

import { useMemo, useState } from 'react';
import {
  Copy,
  ExternalLink,
  FolderKanban,
  Globe2,
  LayoutGrid,
  List,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/site/project';
import type { SiteProject } from '@/lib/site/types';
import SitePreview from './SitePreview';
import { Badge, EmptyState, IconButton, INPUT, BTN_PRIMARY } from './ui';

type Filter = 'all' | 'draft' | 'live';
type Sort = 'updated' | 'name';

export default function ProjectsView({
  projects,
  onOpen,
  onDuplicate,
  onDelete,
  onPublish,
  onNewSite,
}: {
  projects: SiteProject[];
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onPublish: (project: SiteProject) => Promise<{ ok: boolean; error?: string }>;
  onNewSite: () => void;
}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('updated');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  const visible = useMemo(() => {
    const search = query.trim().toLowerCase();
    return projects
      .filter((project) => {
        if (search && !project.title.toLowerCase().includes(search)) return false;
        if (filter === 'live') return Boolean(project.publishedUrl);
        if (filter === 'draft') return !project.publishedUrl;
        return true;
      })
      .sort((a, b) => {
        if (sort === 'name') return a.title.localeCompare(b.title);
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [projects, query, filter, sort]);

  const publish = async (project: SiteProject) => {
    setPublishingId(project.id);
    setPublishError(null);
    const result = await onPublish(project);
    if (!result.ok) setPublishError(result.error ?? 'Could not publish this project.');
    setPublishingId(null);
  };

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: projects.length },
    { key: 'draft', label: 'Drafts', count: projects.filter((p) => !p.publishedUrl).length },
    { key: 'live', label: 'Live', count: projects.filter((p) => p.publishedUrl).length },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[28px] leading-tight font-semibold tracking-[-0.025em]">
            Projects
          </h1>
          <p className="mt-1.5 text-[13px] text-white/45">
            Every portfolio in this workspace, with drafts and live sites in one place.
          </p>
        </div>
        <button type="button" onClick={onNewSite} className={BTN_PRIMARY}>
          <Plus size={14} /> New portfolio
        </button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban size={19} />}
          title="No portfolios yet"
          description="Start from a template built for academic work, or describe your portfolio and let the assistant draft it."
          action={
            <button type="button" onClick={onNewSite} className={BTN_PRIMARY}>
              <Plus size={14} /> Start a portfolio
            </button>
          }
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[210px] flex-1">
              <Search
                size={14}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-white/25"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects…"
                aria-label="Search projects"
                className={INPUT + ' py-2 pl-9 text-[12.5px]'}
              />
            </div>

            <div className="flex items-center rounded-lg border border-white/[0.08] bg-[#0c0d0e] p-0.5">
              {filters.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFilter(item.key)}
                  className={`rounded-md px-2.5 py-1.5 text-[11.5px] font-medium transition ${
                    filter === item.key
                      ? 'bg-white/[0.08] text-white'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {item.label}
                  <span className="ml-1.5 text-[10px] text-white/25">{item.count}</span>
                </button>
              ))}
            </div>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as Sort)}
              aria-label="Sort projects"
              className="rounded-lg border border-white/[0.08] bg-[#0c0d0e] px-2.5 py-2 text-[11.5px] text-white/55 outline-none"
            >
              <option value="updated">Recently updated</option>
              <option value="name">Name A–Z</option>
            </select>

            <div className="flex items-center rounded-lg border border-white/[0.08] bg-[#0c0d0e] p-0.5">
              <button
                type="button"
                onClick={() => setLayout('grid')}
                aria-label="Grid view"
                aria-pressed={layout === 'grid'}
                className={`grid size-7 place-items-center rounded-md transition ${
                  layout === 'grid' ? 'bg-white/[0.08] text-white' : 'text-white/35'
                }`}
              >
                <LayoutGrid size={13} />
              </button>
              <button
                type="button"
                onClick={() => setLayout('list')}
                aria-label="List view"
                aria-pressed={layout === 'list'}
                className={`grid size-7 place-items-center rounded-md transition ${
                  layout === 'list' ? 'bg-white/[0.08] text-white' : 'text-white/35'
                }`}
              >
                <List size={13} />
              </button>
            </div>
          </div>

          {publishError ? (
            <p className="rounded-lg border border-red-400/20 bg-red-400/[0.06] px-3 py-2 text-[12px] text-red-200/90">
              {publishError}
            </p>
          ) : null}

          {visible.length === 0 ? (
            <EmptyState
              icon={<Search size={18} />}
              title="Nothing matches"
              description="Try a different search term or switch the filter back to All."
            />
          ) : layout === 'grid' ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((project) => {
                const path = project.publishedUrl ? safePath(project.publishedUrl) : null;
                return (
                  <article
                    key={project.id}
                    className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101113] transition hover:border-white/[0.15]"
                  >
                    <button
                      type="button"
                      onClick={() => onOpen(project.id)}
                      className="block w-full cursor-pointer text-left"
                      aria-label={`Open ${project.title}`}
                    >
                      <SitePreview project={project} className="aspect-[16/10]" />
                    </button>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="min-w-0 truncate text-[13px] font-medium text-white/85">
                          {project.title}
                        </h2>
                        {project.publishedUrl ? (
                          <Badge tone="live">Live</Badge>
                        ) : (
                          <Badge>Draft</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-[10.5px] text-white/30">
                        {project.pages.length} page{project.pages.length === 1 ? '' : 's'} ·{' '}
                        {project.pages.reduce((sum, page) => sum + page.blocks.length, 0)} blocks ·{' '}
                        {formatRelativeTime(project.updatedAt)}
                      </p>

                      {path ? (
                        <a
                          href={project.publishedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex max-w-full items-center gap-1 text-[11px] text-[#a8d4b8]/90 hover:text-[#d3eadb]"
                        >
                          <span className="truncate">{path}</span>
                          <ExternalLink size={10} className="shrink-0" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void publish(project)}
                          disabled={publishingId === project.id}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-white/40 transition hover:text-white/80 disabled:opacity-50"
                        >
                          {publishingId === project.id ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <Globe2 size={10} />
                          )}
                          Publish to get a link
                        </button>
                      )}

                      <div className="mt-3 flex items-center gap-1 border-t border-white/[0.06] pt-2.5">
                        <button
                          type="button"
                          onClick={() => onOpen(project.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-2.5 py-1.5 text-[11.5px] font-medium text-white/75 transition hover:bg-white/[0.1] hover:text-white"
                        >
                          <Pencil size={11} /> Edit
                        </button>
                        <div className="ml-auto flex items-center gap-0.5">
                          <IconButton label="Duplicate" onClick={() => onDuplicate(project.id)}>
                            <Copy size={13} />
                          </IconButton>
                          {confirmId === project.id ? (
                            <button
                              type="button"
                              onClick={() => {
                                onDelete(project.id);
                                setConfirmId(null);
                              }}
                              className="rounded-lg bg-red-500/90 px-2 py-1 text-[10.5px] font-semibold text-white"
                            >
                              Confirm
                            </button>
                          ) : (
                            <IconButton
                              label="Delete"
                              danger
                              onClick={() => setConfirmId(project.id)}
                            >
                              <Trash2 size={13} />
                            </IconButton>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101113]">
              {visible.map((project) => (
                <div key={project.id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                  <span
                    className="h-8 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: project.accent }}
                  />
                  <button
                    type="button"
                    onClick={() => onOpen(project.id)}
                    className="min-w-0 flex-1 cursor-pointer text-left"
                  >
                    <p className="truncate text-[12.5px] font-medium text-white/85">
                      {project.title}
                    </p>
                    <p className="mt-0.5 truncate text-[10.5px] text-white/30">
                      {project.publishedUrl
                        ? safePath(project.publishedUrl)
                        : `${project.pages.length} pages · draft`}{' '}
                      · edited {formatRelativeTime(project.updatedAt)}
                    </p>
                  </button>
                  {project.publishedUrl ? <Badge tone="live">Live</Badge> : <Badge>Draft</Badge>}
                  <div className="flex items-center gap-0.5">
                    <IconButton label="Duplicate" onClick={() => onDuplicate(project.id)}>
                      <Copy size={13} />
                    </IconButton>
                    {confirmId === project.id ? (
                      <button
                        type="button"
                        onClick={() => {
                          onDelete(project.id);
                          setConfirmId(null);
                        }}
                        className="rounded-lg bg-red-500/90 px-2 py-1 text-[10.5px] font-semibold text-white"
                      >
                        Confirm
                      </button>
                    ) : (
                      <IconButton label="Delete" danger onClick={() => setConfirmId(project.id)}>
                        <Trash2 size={13} />
                      </IconButton>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpen(project.id)}
                    className="hidden rounded-lg border border-white/[0.09] px-2.5 py-1.5 text-[11px] text-white/60 transition hover:border-white/20 hover:text-white sm:inline-flex"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function safePath(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}
