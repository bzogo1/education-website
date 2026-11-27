'use client';

import { ArrowDown, ArrowUp, GripVertical, Layers, Trash2 } from 'lucide-react';
import { BLOCK_CATALOG } from '@/lib/site/blocks';
import type { SitePage } from '@/lib/site/types';
import { BlockIcon } from './blockIcons';

export default function LayersPanel({
  page,
  selectedBlockId,
  onSelect,
  onMove,
  onRemove,
}: {
  page: SitePage | undefined;
  selectedBlockId: string | null;
  onSelect: (blockId: string) => void;
  onMove: (blockId: string, direction: -1 | 1) => void;
  onRemove: (blockId: string) => void;
}) {
  if (!page || page.blocks.length === 0) {
    return (
      <div className="p-4">
        <div className="rounded-xl border border-dashed border-white/[0.09] px-4 py-8 text-center">
          <Layers size={16} className="mx-auto text-white/25" />
          <p className="mt-2 text-[11.5px] text-white/35">
            This page is empty. Add a section from the Add tab.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <p className="px-2 py-2 text-[10.5px] leading-4 text-white/30">
        The order here is the order on the page.
      </p>
      <ul className="space-y-0.5">
        {page.blocks.map((block, index) => {
          const def = BLOCK_CATALOG.find((candidate) => candidate.type === block.type);
          const active = selectedBlockId === block.id;
          return (
            <li key={block.id}>
              <div
                className={`group flex items-center gap-1 rounded-lg border px-1.5 py-1 transition ${
                  active
                    ? 'border-[#6fa384]/40 bg-[#6fa384]/[0.08]'
                    : 'border-transparent hover:bg-white/[0.03]'
                }`}
              >
                <GripVertical size={11} className="shrink-0 text-white/15" />
                <button
                  type="button"
                  onClick={() => onSelect(block.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 py-1 text-left"
                >
                  <span className="text-white/35">
                    <BlockIcon name={def?.icon ?? ''} size={12} />
                  </span>
                  <span
                    className={`truncate text-[11.5px] ${
                      active ? 'text-white' : 'text-white/55'
                    }`}
                  >
                    {def?.label ?? block.type}
                  </span>
                </button>
                <span className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => onMove(block.id, -1)}
                    disabled={index === 0}
                    aria-label="Move block up"
                    className="grid size-5 place-items-center rounded text-white/30 hover:bg-white/[0.06] hover:text-white disabled:opacity-20"
                  >
                    <ArrowUp size={10} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMove(block.id, 1)}
                    disabled={index === page.blocks.length - 1}
                    aria-label="Move block down"
                    className="grid size-5 place-items-center rounded text-white/30 hover:bg-white/[0.06] hover:text-white disabled:opacity-20"
                  >
                    <ArrowDown size={10} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(block.id)}
                    aria-label="Delete block"
                    className="grid size-5 place-items-center rounded text-white/30 hover:bg-red-400/10 hover:text-red-300"
                  >
                    <Trash2 size={10} />
                  </button>
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
