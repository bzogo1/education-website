'use client';

import { ArrowDown, ArrowLeft, ArrowUp, Copy, SlidersHorizontal, Trash2, X } from 'lucide-react';
import { getBlockDef, type FieldSpec } from '@/lib/site/blocks';
import { slugify } from '@/lib/site/project';
import type { SiteBlock, SitePage, SiteProject } from '@/lib/site/types';
import { INPUT, LABEL } from './dashboard/ui';

type Item = Record<string, unknown>;

export function SiteDesignFields({
  project,
  page,
  onUpdateProject,
  onUpdatePage,
}: {
  project: SiteProject;
  page: SitePage | undefined;
  onUpdateProject: (patch: Partial<SiteProject>) => void;
  onUpdatePage: (patch: { name?: string; slug?: string }) => void;
}) {
  const accents = [
    '#2f6f4e',
    '#1d4ed8',
    '#9a6b2f',
    '#c026d3',
    '#0f766e',
    '#b91c1c',
    '#334155',
    '#111827',
  ];

  return (
    <div className="space-y-6 p-4">
      <section>
        <p className="mb-2 text-[10.5px] font-semibold tracking-[0.14em] text-white/30 uppercase">
          Site
        </p>
        <label htmlFor="site-title" className={LABEL}>
          Title
        </label>
        <input
          id="site-title"
          value={project.title}
          onChange={(event) => onUpdateProject({ title: event.target.value })}
          className={INPUT + ' py-2'}
        />
        <label htmlFor="site-description" className={LABEL + ' mt-3'}>
          Description
        </label>
        <textarea
          id="site-description"
          value={project.description ?? ''}
          onChange={(event) => onUpdateProject({ description: event.target.value })}
          rows={2}
          placeholder="One sentence that describes this portfolio."
          className={INPUT + ' resize-none py-2'}
        />
        <label htmlFor="site-slug" className={LABEL + ' mt-3'}>
          URL slug
        </label>
        <input
          id="site-slug"
          value={project.slug}
          onChange={(event) => onUpdateProject({ slug: slugify(event.target.value) })}
          className={INPUT + ' py-2 font-mono text-[11.5px]'}
        />
        <p className="mt-1.5 text-[10.5px] leading-4 text-white/25">
          /u/{project.handle ?? 'your-name'}/{project.slug || 'portfolio'}
          {project.publishedUrl ? ' · live sites keep their current URL' : ''}
        </p>
      </section>

      <section>
        <p className="mb-2 text-[10.5px] font-semibold tracking-[0.14em] text-white/30 uppercase">
          Accent
        </p>
        <div className="flex flex-wrap gap-1.5">
          {accents.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Use accent ${color}`}
              onClick={() => onUpdateProject({ accent: color })}
              className={`size-6 rounded-full border transition ${
                project.accent.toLowerCase() === color.toLowerCase()
                  ? 'scale-110 border-white'
                  : 'border-white/10 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          <label
            className="relative grid size-6 cursor-pointer place-items-center rounded-full border border-white/15 text-[10px] text-white/40 hover:border-white/35"
            title="Custom colour"
          >
            +
            <input
              type="color"
              value={project.accent}
              onChange={(event) => onUpdateProject({ accent: event.target.value })}
              className="absolute inset-0 cursor-pointer opacity-0"
              aria-label="Custom accent colour"
            />
          </label>
        </div>
        <p className="mt-2 font-mono text-[10px] text-white/25">{project.accent}</p>
      </section>

      <section>
        <p className="mb-2 text-[10.5px] font-semibold tracking-[0.14em] text-white/30 uppercase">
          Appearance
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {(['light', 'dark'] as const).map((modeValue) => (
            <button
              key={modeValue}
              type="button"
              onClick={() => onUpdateProject({ theme: { ...project.theme, mode: modeValue } })}
              className={`rounded-lg border px-2 py-2 text-[11.5px] capitalize transition ${
                project.theme.mode === modeValue
                  ? 'border-[#6fa384]/50 bg-[#6fa384]/10 text-white'
                  : 'border-white/[0.08] text-white/45 hover:border-white/20'
              }`}
            >
              {modeValue}
            </button>
          ))}
          {(['sans', 'serif'] as const).map((fontValue) => (
            <button
              key={fontValue}
              type="button"
              onClick={() => onUpdateProject({ theme: { ...project.theme, font: fontValue } })}
              className={`rounded-lg border px-2 py-2 text-[11.5px] transition ${
                project.theme.font === fontValue
                  ? 'border-[#6fa384]/50 bg-[#6fa384]/10 text-white'
                  : 'border-white/[0.08] text-white/45 hover:border-white/20'
              }`}
            >
              <span className={fontValue === 'serif' ? 'font-serif' : ''}>Aa</span>{' '}
              <span className="capitalize">{fontValue}</span>
            </button>
          ))}
        </div>
      </section>

      {page ? (
        <section>
          <p className="mb-2 text-[10.5px] font-semibold tracking-[0.14em] text-white/30 uppercase">
            This page
          </p>
          <label htmlFor="page-name" className={LABEL}>
            Name
          </label>
          <input
            id="page-name"
            value={page.name}
            onChange={(event) => onUpdatePage({ name: event.target.value })}
            className={INPUT + ' py-2'}
          />
          <label htmlFor="page-slug" className={LABEL + ' mt-3'}>
            URL slug
          </label>
          <input
            id="page-slug"
            value={page.slug}
            onChange={(event) => onUpdatePage({ slug: event.target.value })}
            className={INPUT + ' py-2 font-mono text-[11.5px]'}
          />
          <p className="mt-1.5 text-[10.5px] leading-4 text-white/25">
            The first page is the portfolio home. Other pages get their own path.
          </p>
        </section>
      ) : null}
    </div>
  );
}

function ItemEditor({
  field,
  value,
  onChange,
}: {
  field: FieldSpec;
  value: unknown;
  onChange: (next: Item[]) => void;
}) {
  const items = Array.isArray(value) ? (value as Item[]) : [];
  const subFields = field.itemFields ?? [];

  const update = (index: number, key: string, nextValue: string) => {
    onChange(
      items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: nextValue } : item))
    );
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-white/[0.08] bg-[#0b0c0d] p-2.5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="truncate text-[10.5px] font-medium text-white/45">
              {String(item[field.itemLabelKey ?? 'title'] ?? `Item ${index + 1}`) ||
                `Item ${index + 1}`}
            </span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
              aria-label="Remove item"
              className="grid size-5 place-items-center rounded text-white/25 transition hover:bg-red-400/10 hover:text-red-300"
            >
              <X size={11} />
            </button>
          </div>
          <div className="space-y-1.5">
            {subFields.map((sub) => (
              <div key={sub.key}>
                <label className="mb-0.5 block text-[9.5px] tracking-wide text-white/30 uppercase">
                  {sub.label}
                </label>
                {sub.type === 'textarea' ? (
                  <textarea
                    value={String(item[sub.key] ?? '')}
                    onChange={(event) => update(index, sub.key, event.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-md border border-white/[0.08] bg-[#101113] px-2 py-1.5 text-[11.5px] text-white/80 outline-none focus:border-[#6fa384]/60"
                  />
                ) : (
                  <input
                    value={String(item[sub.key] ?? '')}
                    onChange={(event) => update(index, sub.key, event.target.value)}
                    className="w-full rounded-md border border-white/[0.08] bg-[#101113] px-2 py-1.5 text-[11.5px] text-white/80 outline-none focus:border-[#6fa384]/60"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      {field.newItem ? (
        <button
          type="button"
          onClick={() => onChange([...items, field.newItem!()])}
          className="w-full rounded-lg border border-dashed border-white/[0.12] py-1.5 text-[11px] text-white/40 transition hover:border-white/25 hover:text-white/75"
        >
          + Add {field.label.toLowerCase()}
        </button>
      ) : null}
    </div>
  );
}

function BlockField({
  field,
  value,
  onChange,
}: {
  field: FieldSpec;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  if (field.type === 'items') {
    return <ItemEditor field={field} value={value} onChange={onChange} />;
  }
  if (field.type === 'textarea') {
    return (
      <textarea
        value={String(value ?? '')}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className={INPUT + ' resize-y py-2 text-[12px] leading-5'}
      />
    );
  }
  if (field.type === 'select') {
    return (
      <select
        value={String(value ?? '')}
        onChange={(event) => onChange(event.target.value)}
        className={INPUT + ' py-2 text-[12px]'}
      >
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
  return (
    <input
      value={String(value ?? '')}
      onChange={(event) => onChange(event.target.value)}
      placeholder={field.placeholder}
      type={field.type === 'url' ? 'url' : 'text'}
      className={INPUT + ' py-2 text-[12px]'}
    />
  );
}

export default function InspectorPanel({
  project,
  page,
  block,
  index,
  total,
  onClose,
  onClearSelection,
  onUpdateProject,
  onUpdatePage,
  onUpdateProps,
  onDeleteBlock,
  onDuplicateBlock,
  onMoveBlock,
}: {
  project: SiteProject;
  page: SitePage | undefined;
  block: SiteBlock | null;
  index: number;
  total: number;
  onClose: () => void;
  onClearSelection: () => void;
  onUpdateProject: (patch: Partial<SiteProject>) => void;
  onUpdatePage: (patch: { name?: string; slug?: string }) => void;
  onUpdateProps: (blockId: string, props: Record<string, unknown>) => void;
  onDeleteBlock: (blockId: string) => void;
  onDuplicateBlock: (blockId: string) => void;
  onMoveBlock: (blockId: string, direction: -1 | 1) => void;
}) {
  const def = block ? getBlockDef(block.type) : undefined;

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#0a0b0c]">
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-white/[0.07] px-3">
        <SlidersHorizontal size={13} className="text-white/30" />
        <span className="flex-1 text-[11px] font-semibold tracking-[0.1em] text-white/40 uppercase">
          {block ? (def?.label ?? 'Block') : 'Site settings'}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close inspector"
          className="grid size-6 place-items-center rounded text-white/30 transition hover:bg-white/[0.05] hover:text-white xl:hidden"
        >
          <X size={13} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {block ? (
          <div className="p-4">
            <button
              type="button"
              onClick={onClearSelection}
              className="mb-3 inline-flex items-center gap-1 text-[10.5px] text-white/35 transition hover:text-white"
            >
              <ArrowLeft size={10} /> Site settings
            </button>
            <p className="mb-3 rounded-lg bg-white/[0.03] px-2.5 py-2 text-[10.5px] leading-4 text-white/35">
              {def?.description ?? 'Edit this block’s content.'}
            </p>
            <div className="space-y-3">
              {def?.fields.map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-[10px] font-medium tracking-wide text-white/40">
                    {field.label}
                  </label>
                  <BlockField
                    field={field}
                    value={block.props[field.key]}
                    onChange={(next) =>
                      onUpdateProps(block.id, { ...block.props, [field.key]: next })
                    }
                  />
                </div>
              ))}
              {!def?.fields.length ? (
                <p className="text-[11.5px] text-white/30">
                  This block has no editable fields yet.
                </p>
              ) : null}
            </div>

            <div className="mt-5 flex items-center gap-1 border-t border-white/[0.07] pt-3">
              <button
                type="button"
                onClick={() => onMoveBlock(block.id, -1)}
                disabled={index <= 0}
                title="Move up"
                className="grid size-7 place-items-center rounded-lg text-white/35 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-25"
              >
                <ArrowUp size={13} />
              </button>
              <button
                type="button"
                onClick={() => onMoveBlock(block.id, 1)}
                disabled={index >= total - 1}
                title="Move down"
                className="grid size-7 place-items-center rounded-lg text-white/35 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-25"
              >
                <ArrowDown size={13} />
              </button>
              <button
                type="button"
                onClick={() => onDuplicateBlock(block.id)}
                title="Duplicate block"
                className="grid size-7 place-items-center rounded-lg text-white/35 transition hover:bg-white/[0.05] hover:text-white"
              >
                <Copy size={13} />
              </button>
              <button
                type="button"
                onClick={() => onDeleteBlock(block.id)}
                title="Delete block"
                className="ml-auto grid size-7 place-items-center rounded-lg text-white/35 transition hover:bg-red-400/10 hover:text-red-300"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ) : (
          <SiteDesignFields
            project={project}
            page={page}
            onUpdateProject={onUpdateProject}
            onUpdatePage={onUpdatePage}
          />
        )}
      </div>
    </div>
  );
}
