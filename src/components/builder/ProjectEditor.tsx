'use client';

import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Eye,
  Globe,
  Layers,
  Loader2,
  Monitor,
  Palette,
  Plus,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Tablet,
  Trash2,
  X,
} from 'lucide-react';
import { compilePageHtml } from '@/lib/site/compile';
import { makeBlock, makePage } from '@/lib/site/blocks';
import { newId, slugify, uniqueSlug } from '@/lib/site/project';
import type { BlockType, SiteProject } from '@/lib/site/types';
import type { SaveState, WorkspaceMode } from '@/lib/site/store';
import AiPanel from './AiPanel';
import BrowserFrame, { type Device } from './BrowserFrame';
import ElementsPanel from './ElementsPanel';
import InspectorPanel, { SiteDesignFields } from './InspectorPanel';
import LayersPanel from './LayersPanel';
import { CopyButton, Modal, BTN_GHOST } from './dashboard/ui';

type Tab = 'add' | 'layers' | 'design' | 'ai';

const TABS: { id: Tab; label: string; icon: typeof Plus }[] = [
  { id: 'add', label: 'Add', icon: Plus },
  { id: 'layers', label: 'Layers', icon: Layers },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'ai', label: 'AI', icon: Sparkles },
];

const DEVICES: { id: Device; icon: typeof Monitor; label: string }[] = [
  { id: 'desktop', icon: Monitor, label: 'Desktop' },
  { id: 'tablet', icon: Tablet, label: 'Tablet' },
  { id: 'mobile', icon: Smartphone, label: 'Mobile' },
];

export default function ProjectEditor({
  project,
  mode,
  saveState,
  onBack,
  onUpdate,
  onPublish,
  onDelete,
}: {
  project: SiteProject;
  mode: WorkspaceMode;
  saveState: SaveState;
  onBack: () => void;
  onUpdate: (updater: (project: SiteProject) => SiteProject) => void;
  onPublish: (project: SiteProject) => Promise<{ ok: boolean; error?: string }>;
  onDelete: () => void;
}) {
  const [tab, setTab] = useState<Tab>('add');
  const [device, setDevice] = useState<Device>('desktop');
  const [activePageId, setActivePageId] = useState(project.pages[0]?.id ?? '');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishedNow, setPublishedNow] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const activePage = project.pages.find((page) => page.id === activePageId) ?? project.pages[0];
  const selectedBlock = activePage?.blocks.find((block) => block.id === selectedBlockId) ?? null;
  const selectedIndex = selectedBlock
    ? (activePage?.blocks.findIndex((block) => block.id === selectedBlock.id) ?? -1)
    : -1;

  const html = useMemo(
    () =>
      activePage
        ? compilePageHtml(activePage, project, { preview: true, selectable: !previewMode })
        : '',
    [activePage, project, previewMode]
  );

  const mutate = (fn: (draft: SiteProject) => void) => {
    onUpdate((current) => {
      const next: SiteProject = JSON.parse(JSON.stringify(current));
      fn(next);
      return next;
    });
  };

  const addBlockToPage = (type: string) => {
    if (!activePage) return;
    const block = makeBlock(type as BlockType);
    mutate((draft) => {
      const page = draft.pages.find((candidate) => candidate.id === activePage.id);
      if (!page) return;
      const footerIndex = page.blocks.findIndex((candidate) => candidate.type === 'footer');
      page.blocks.splice(footerIndex === -1 ? page.blocks.length : footerIndex, 0, block);
      if (draft.source === 'template') draft.source = 'elements';
    });
    setSelectedBlockId(block.id);
    setInspectorOpen(true);
  };

  const moveBlock = (blockId: string, direction: -1 | 1) => {
    if (!activePage) return;
    mutate((draft) => {
      const page = draft.pages.find((candidate) => candidate.id === activePage.id);
      if (!page) return;
      const index = page.blocks.findIndex((candidate) => candidate.id === blockId);
      const target = index + direction;
      if (index === -1 || target < 0 || target >= page.blocks.length) return;
      [page.blocks[index], page.blocks[target]] = [page.blocks[target], page.blocks[index]];
    });
  };

  const removeBlock = (blockId: string) => {
    if (!activePage) return;
    mutate((draft) => {
      const page = draft.pages.find((candidate) => candidate.id === activePage.id);
      if (page) page.blocks = page.blocks.filter((candidate) => candidate.id !== blockId);
    });
    if (selectedBlockId === blockId) setSelectedBlockId(null);
  };

  const duplicateBlock = (blockId: string) => {
    if (!activePage) return;
    const source = activePage.blocks.find((block) => block.id === blockId);
    if (!source) return;
    const copy = { ...(JSON.parse(JSON.stringify(source)) as typeof source), id: newId('b') };
    mutate((draft) => {
      const page = draft.pages.find((candidate) => candidate.id === activePage.id);
      if (!page) return;
      const index = page.blocks.findIndex((candidate) => candidate.id === blockId);
      page.blocks.splice(index + 1, 0, copy);
    });
    setSelectedBlockId(copy.id);
  };

  const updateProps = (blockId: string, props: Record<string, unknown>) => {
    if (!activePage) return;
    mutate((draft) => {
      const page = draft.pages.find((candidate) => candidate.id === activePage.id);
      const block = page?.blocks.find((candidate) => candidate.id === blockId);
      if (block) block.props = props;
    });
  };

  const updatePage = (patch: { name?: string; slug?: string }) => {
    if (!activePage) return;
    mutate((draft) => {
      const page = draft.pages.find((candidate) => candidate.id === activePage.id);
      if (!page) return;
      if (patch.name !== undefined) page.name = patch.name;
      if (patch.slug !== undefined) page.slug = slugify(patch.slug, page.slug);
    });
  };

  const addPage = (name: string) => {
    const clean = name.trim();
    if (!clean) return;
    const sourcePage = project.pages[0];
    const page = makePage(
      clean,
      uniqueSlug(
        slugify(clean, 'page'),
        project.pages.map((candidate) => candidate.slug)
      )
    );
    const navigation = makeBlock('navbar');
    const footer = makeBlock('footer');
    const sourceNav = sourcePage?.blocks.find((block) => block.type === 'navbar');
    const sourceFooter = sourcePage?.blocks.find((block) => block.type === 'footer');
    if (sourceNav) navigation.props = JSON.parse(JSON.stringify(sourceNav.props));
    if (sourceFooter) footer.props = JSON.parse(JSON.stringify(sourceFooter.props));
    page.blocks = [navigation, footer];

    mutate((draft) => {
      draft.pages.push(page);
    });
    setActivePageId(page.id);
    setSelectedBlockId(null);
  };

  const deletePage = (pageId: string) => {
    if (project.pages.length <= 1) return;
    const remaining = project.pages.filter((page) => page.id !== pageId);
    mutate((draft) => {
      draft.pages = draft.pages.filter((page) => page.id !== pageId);
    });
    if (activePageId === pageId) {
      setActivePageId(remaining[0]?.id ?? '');
      setSelectedBlockId(null);
    }
  };

  const publish = async () => {
    setPublishing(true);
    setPublishError(null);
    const result = await onPublish(project);
    if (!result.ok) {
      setPublishError(result.error ?? 'Publishing failed.');
      setPublishedNow(false);
    } else {
      setPublishedNow(true);
    }
    setPublishing(false);
  };

  const saveLabel =
    saveState === 'saving'
      ? 'Saving…'
      : saveState === 'error'
        ? 'Save failed'
        : mode === 'cloud'
          ? 'Saved'
          : 'Saved locally';

  const isHome = activePage?.id === project.pages[0]?.id;
  const urlLabel = project.handle
    ? `/u/${project.handle}/${project.slug}${isHome ? '' : `/${activePage?.slug ?? ''}`}`
    : `folio.site/${project.slug}${isHome ? '' : `/${activePage?.slug ?? ''}`}`;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#08090a] text-[#f2f1ec]">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-white/[0.07] bg-[#090a0b] px-2.5 sm:px-3">
        <button
          type="button"
          onClick={onBack}
          title="Back to workspace"
          aria-label="Back to workspace"
          className="grid size-8 place-items-center rounded-lg text-white/40 transition hover:bg-white/[0.05] hover:text-white"
        >
          <ArrowLeft size={15} />
        </button>

        <div className="flex min-w-0 items-center gap-2">
          <input
            value={project.title}
            onChange={(event) => onUpdate((current) => ({ ...current, title: event.target.value }))}
            aria-label="Project title"
            className="w-36 truncate rounded-md border border-transparent bg-transparent px-1.5 py-1 text-[12.5px] font-medium text-white/85 transition outline-none hover:border-white/[0.1] focus:border-[#6fa384] sm:w-52"
          />
          <span
            className="hidden items-center gap-1.5 text-[10.5px] text-white/30 md:inline-flex"
            title={saveLabel}
          >
            <span
              className={`size-1.5 rounded-full ${
                saveState === 'error'
                  ? 'bg-red-400'
                  : saveState === 'saving'
                    ? 'animate-pulse bg-amber-300'
                    : 'bg-emerald-400/70'
              }`}
            />
            {saveLabel}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <div className="hidden items-center rounded-lg border border-white/[0.08] bg-[#0c0d0e] p-0.5 md:flex">
            {DEVICES.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setDevice(id)}
                title={label}
                aria-label={label}
                aria-pressed={device === id}
                className={`grid size-6 place-items-center rounded-md transition ${
                  device === id ? 'bg-white/[0.09] text-white' : 'text-white/30 hover:text-white/70'
                }`}
              >
                <Icon size={12} />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setPanelOpen(true);
              setTab('add');
            }}
            className="grid size-8 place-items-center rounded-lg text-white/40 transition hover:bg-white/[0.05] hover:text-white lg:hidden"
            title="Add sections"
            aria-label="Add sections"
          >
            <Layers size={14} />
          </button>

          <button
            type="button"
            onClick={() => setInspectorOpen(true)}
            className="grid size-8 place-items-center rounded-lg text-white/40 transition hover:bg-white/[0.05] hover:text-white xl:hidden"
            title="Properties"
            aria-label="Properties"
          >
            <SlidersHorizontal size={14} />
          </button>

          <button
            type="button"
            onClick={() => {
              setPreviewMode((value) => !value);
              setSelectedBlockId(null);
              setPanelOpen(false);
            }}
            className={`hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11.5px] font-medium transition sm:inline-flex ${
              previewMode
                ? 'border-[#6fa384]/40 bg-[#6fa384]/10 text-[#cfe5d7]'
                : 'border-white/[0.09] text-white/55 hover:border-white/20 hover:text-white'
            }`}
          >
            <Eye size={12} /> {previewMode ? 'Exit preview' : 'Preview'}
          </button>

          {project.publishedUrl ? (
            <a
              href={project.publishedUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1 text-[11px] text-[#a8d4b8] hover:text-[#d3eadb] lg:flex"
            >
              <Eye size={11} /> Live
            </a>
          ) : null}

          <button
            type="button"
            onClick={() => void publish()}
            disabled={publishing}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#d7e8dc] px-3 py-1.5 text-[11.5px] font-semibold text-[#0d1a12] transition hover:bg-[#e6f2e9] disabled:opacity-60"
          >
            {publishing ? <Loader2 size={12} className="animate-spin" /> : <Globe size={12} />}
            {project.publishedUrl ? 'Republish' : 'Publish'}
          </button>

          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            title="Delete project"
            aria-label="Delete project"
            className="grid size-8 place-items-center rounded-lg text-white/30 transition hover:bg-red-400/10 hover:text-red-300"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </header>

      {publishedNow && project.publishedUrl ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-2 text-[11px] text-emerald-100/80">
          <Check size={12} />
          <span>Your portfolio is live at</span>
          <a
            href={project.publishedUrl}
            target="_blank"
            rel="noreferrer"
            className="max-w-[280px] truncate font-medium underline decoration-emerald-300/30 underline-offset-2"
          >
            {project.publishedUrl}
          </a>
          <CopyButton value={project.publishedUrl} label="Copy link" />
          <button
            type="button"
            onClick={() => setPublishedNow(false)}
            className="ml-auto text-white/30 transition hover:text-white"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      {publishError ? (
        <div className="flex shrink-0 items-start gap-2 border-b border-red-400/20 bg-red-400/[0.06] px-3 py-2 text-[11px] leading-4 text-red-200/90">
          <span className="flex-1">{publishError}</span>
          <button
            type="button"
            onClick={() => setPublishError(null)}
            className="text-red-200/50 hover:text-red-100"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1">
        {!previewMode ? (
          <aside
            className={`${
              panelOpen ? 'fixed inset-y-0 left-0 z-40 flex w-[288px] shadow-2xl' : 'hidden'
            } shrink-0 flex-col border-r border-white/[0.07] bg-[#090a0b] lg:static lg:z-auto lg:flex`}
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-2 lg:hidden">
              <span className="text-[10px] font-semibold tracking-[0.13em] text-white/40 uppercase">
                Editor
              </span>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                aria-label="Close editor panel"
                className="grid size-6 place-items-center rounded text-white/35 hover:bg-white/[0.05] hover:text-white"
              >
                <X size={13} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-0.5 border-b border-white/[0.07] p-1.5">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  aria-pressed={tab === id}
                  className={`flex flex-col items-center gap-1 rounded-lg py-1.5 text-[9.5px] font-medium transition ${
                    tab === id
                      ? 'bg-white/[0.07] text-white'
                      : 'text-white/35 hover:bg-white/[0.03] hover:text-white/70'
                  }`}
                >
                  <Icon size={13} className={tab === id ? 'text-[#a8d4b8]' : ''} />
                  {label}
                </button>
              ))}
            </div>
            <div
              className={`min-h-0 flex-1 ${tab === 'ai' ? 'overflow-hidden' : 'overflow-y-auto'}`}
            >
              {tab === 'add' ? (
                <ElementsPanel page={activePage} onAddBlock={addBlockToPage} />
              ) : null}
              {tab === 'layers' ? (
                <LayersPanel
                  page={activePage}
                  selectedBlockId={selectedBlockId}
                  onSelect={(id) => {
                    setSelectedBlockId(id);
                    setInspectorOpen(true);
                  }}
                  onMove={moveBlock}
                  onRemove={removeBlock}
                />
              ) : null}
              {tab === 'design' ? (
                <SiteDesignFields
                  project={project}
                  page={activePage}
                  onUpdateProject={(patch) => onUpdate((current) => ({ ...current, ...patch }))}
                  onUpdatePage={updatePage}
                />
              ) : null}
              {tab === 'ai' ? (
                <AiPanel
                  project={project}
                  onApplySite={(site) => {
                    onUpdate((current) => ({
                      ...current,
                      title: site.title || current.title,
                      description: site.description ?? current.description,
                      accent: site.accent || current.accent,
                      theme: site.theme ?? current.theme,
                      pages:
                        Array.isArray(site.pages) && site.pages.length > 0
                          ? site.pages
                          : current.pages,
                      slug: site.slug || current.slug,
                    }));
                    setSelectedBlockId(null);
                    const first = site.pages?.[0];
                    if (first) setActivePageId(first.id);
                  }}
                />
              ) : null}
            </div>
          </aside>
        ) : null}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <BrowserFrame
            html={html}
            urlLabel={urlLabel}
            pages={project.pages}
            activePageId={activePage?.id ?? ''}
            device={device}
            onSelectPage={(id) => {
              setActivePageId(id);
              setSelectedBlockId(null);
            }}
            onAddPage={addPage}
            onDeletePage={deletePage}
            onDropBlock={addBlockToPage}
            onSelectBlock={(id) => {
              setSelectedBlockId(id);
              setInspectorOpen(true);
            }}
          />
        </div>

        {!previewMode ? (
          <aside
            className={`${
              inspectorOpen ? 'fixed inset-y-0 right-0 z-40 flex w-[318px] shadow-2xl' : 'hidden'
            } border-l border-white/[0.07] xl:static xl:z-auto xl:flex xl:w-[304px] xl:shadow-none`}
          >
            <div className="min-h-0 w-full">
              <InspectorPanel
                project={project}
                page={activePage}
                block={selectedBlock}
                index={selectedIndex}
                total={activePage?.blocks.length ?? 0}
                onClose={() => setInspectorOpen(false)}
                onClearSelection={() => setSelectedBlockId(null)}
                onUpdateProject={(patch) => onUpdate((current) => ({ ...current, ...patch }))}
                onUpdatePage={updatePage}
                onUpdateProps={updateProps}
                onDeleteBlock={removeBlock}
                onDuplicateBlock={duplicateBlock}
                onMoveBlock={moveBlock}
              />
            </div>
          </aside>
        ) : null}
      </div>

      {previewMode ? (
        <div className="pointer-events-none fixed bottom-4 left-1/2 z-30 -translate-x-1/2">
          <button
            type="button"
            onClick={() => setPreviewMode(false)}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-[#0b0c0d]/90 px-4 py-2 text-[11.5px] font-medium text-white/80 shadow-xl backdrop-blur transition hover:text-white"
          >
            <ArrowLeft size={12} /> Back to editing
          </button>
        </div>
      ) : null}

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this project?"
      >
        <div className="p-5">
          <p className="text-[12.5px] leading-5 text-white/50">
            <span className="font-medium text-white/80">{project.title}</span> and its pages will be
            removed from this workspace. If it is published, the public link will stop working. This
            cannot be undone.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" onClick={() => setConfirmDelete(false)} className={BTN_GHOST}>
              Keep project
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmDelete(false);
                onDelete();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3.5 py-2 text-[12px] font-semibold text-white transition hover:bg-red-400"
            >
              <Trash2 size={12} /> Delete project
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
