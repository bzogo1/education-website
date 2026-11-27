'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { BLOCK_CATALOG, BLOCK_CATEGORIES, type BlockCategory } from '@/lib/site/blocks';
import { BlockIcon } from './blockIcons';
import { BLOCK_MIME } from './BrowserFrame';
import type { SitePage } from '@/lib/site/types';

const CATEGORY_COPY: Record<BlockCategory, string> = {
  Structure: 'The frame of every page.',
  Intro: 'First impressions and numbers.',
  Academics: 'The record: courses, roles, honors.',
  Showcase: 'Work you can point to.',
  Contact: 'How people reach you.',
  Marketing: 'Optional extras.',
};

export default function ElementsPanel({
  page,
  onAddBlock,
}: {
  page: SitePage | undefined;
  onAddBlock: (type: string) => void;
}) {
  const [query, setQuery] = useState('');

  const grouped = useMemo(() => {
    const search = query.trim().toLowerCase();
    return BLOCK_CATEGORIES.map((category) => ({
      category,
      blocks: BLOCK_CATALOG.filter((block) => {
        if (block.category !== category) return false;
        if (!search) return true;
        return `${block.label} ${block.description}`.toLowerCase().includes(search);
      }),
    })).filter((group) => group.blocks.length > 0);
  }, [query]);

  return (
    <div className="p-3">
      <div className="relative">
        <Search
          size={13}
          className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-white/25"
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search sections…"
          aria-label="Search sections"
          className="w-full rounded-lg border border-white/[0.08] bg-[#0b0c0d] py-1.5 pr-2 pl-8 text-[11.5px] text-white/80 outline-none placeholder:text-white/25 focus:border-[#6fa384]/60"
        />
      </div>

      <p className="mt-3 px-1 text-[10.5px] leading-4 text-white/30">
        Click to add to <span className="text-white/50">{page?.name ?? 'this page'}</span>, or drag
        it into the canvas.
      </p>

      {grouped.length === 0 ? (
        <p className="mt-6 text-center text-[11.5px] text-white/30">No sections match.</p>
      ) : null}

      {grouped.map((group) => (
        <section key={group.category} className="mt-4">
          <div className="mb-1.5 flex items-baseline justify-between gap-2 px-1">
            <h3 className="text-[10px] font-semibold tracking-[0.12em] text-white/30 uppercase">
              {group.category}
            </h3>
            <span className="text-[9.5px] text-white/20">{CATEGORY_COPY[group.category]}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {group.blocks.map((block) => (
              <button
                key={block.type}
                type="button"
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData(BLOCK_MIME, block.type);
                  event.dataTransfer.setData('text/plain', block.type);
                  event.dataTransfer.effectAllowed = 'copy';
                }}
                onClick={() => onAddBlock(block.type)}
                title={block.description}
                className="group flex cursor-grab flex-col items-start gap-1.5 rounded-lg border border-white/[0.06] bg-[#0e0f10] px-2.5 py-2 text-left transition hover:border-[#6fa384]/35 hover:bg-[#111614] active:cursor-grabbing"
              >
                <span className="text-white/40 transition group-hover:text-[#a8d4b8]">
                  <BlockIcon name={block.icon} size={15} />
                </span>
                <span className="text-[11px] leading-4 font-medium text-white/70">{block.label}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
