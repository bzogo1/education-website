'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Lock, Plus, RotateCw, X } from 'lucide-react';
import type { SitePage } from '@/lib/site/types';

export const BLOCK_MIME = 'application/x-studio-block';

export type Device = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTH: Record<Device, string> = {
  desktop: 'w-full',
  tablet: 'w-[834px] max-w-full',
  mobile: 'w-[390px] max-w-full',
};

export default function BrowserFrame({
  html,
  urlLabel,
  pages,
  activePageId,
  device = 'desktop',
  onSelectPage,
  onAddPage,
  onDeletePage,
  onDropBlock,
  onSelectBlock,
}: {
  html: string;
  urlLabel: string;
  pages: SitePage[];
  activePageId: string;
  device?: Device;
  onSelectPage: (id: string) => void;
  onAddPage: (name: string) => void;
  onDeletePage: (id: string) => void;
  onDropBlock: (type: string) => void;
  onSelectBlock?: (blockId: string) => void;
}) {
  const [nonce, setNonce] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [addingPage, setAddingPage] = useState(false);
  const [pageName, setPageName] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const activeIndex = pages.findIndex((page) => page.id === activePageId);
  const go = (delta: number) => {
    const next = pages[activeIndex + delta];
    if (next) onSelectPage(next.id);
  };

  const submitPage = () => {
    const name = pageName.trim();
    if (name) onAddPage(name);
    setPageName('');
    setAddingPage(false);
  };

  useEffect(() => {
    if (!onSelectBlock) return;
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; blockId?: string } | null;
      if (data?.type === 'folio:block' && typeof data.blockId === 'string') {
        onSelectBlock(data.blockId);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onSelectBlock]);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="flex items-center gap-1 overflow-x-auto border-b border-white/[0.07] bg-[#0a0b0c] px-2.5 pt-2">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`group flex shrink-0 cursor-pointer items-center gap-1.5 rounded-t-md px-2.5 py-1.5 text-[11px] transition ${
              page.id === activePageId
                ? 'border border-white/[0.08] border-b-[#0a0b0c] bg-[#0a0b0c] text-white/85'
                : 'border border-transparent text-white/35 hover:text-white/70'
            }`}
            onClick={() => onSelectPage(page.id)}
          >
            <span className="max-w-24 truncate">{page.name}</span>
            {pages.length > 1 ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeletePage(page.id);
                }}
                className="text-white/25 opacity-0 transition group-hover:opacity-100 hover:text-red-300"
                title="Delete page"
                aria-label={`Delete ${page.name}`}
              >
                <X size={10} />
              </button>
            ) : null}
          </div>
        ))}
        {addingPage ? (
          <input
            ref={nameInputRef}
            autoFocus
            value={pageName}
            onChange={(event) => setPageName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitPage();
              if (event.key === 'Escape') setAddingPage(false);
            }}
            onBlur={submitPage}
            placeholder="Page name"
            className="mb-1 ml-1 w-24 rounded border border-white/[0.12] bg-[#101113] px-2 py-1 text-[11px] text-white/80 outline-none placeholder:text-white/25"
          />
        ) : (
          <button
            type="button"
            onClick={() => setAddingPage(true)}
            className="mb-1 ml-1 grid size-6 shrink-0 place-items-center rounded text-white/30 transition hover:bg-white/[0.05] hover:text-white/80"
            title="Add page"
          >
            <Plus size={12} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 border-b border-white/[0.07] bg-[#0a0b0c] px-2.5 py-2">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={activeIndex <= 0}
          className="grid size-6 place-items-center rounded text-white/35 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-25"
          title="Previous page"
        >
          <ArrowLeft size={12} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={activeIndex >= pages.length - 1}
          className="grid size-6 place-items-center rounded text-white/35 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-25"
          title="Next page"
        >
          <ArrowRight size={12} />
        </button>
        <button
          type="button"
          onClick={() => setNonce((value) => value + 1)}
          className="grid size-6 place-items-center rounded text-white/35 transition hover:bg-white/[0.06] hover:text-white"
          title="Reload preview"
        >
          <RotateCw size={11} />
        </button>
        <div className="flex h-7 min-w-0 flex-1 items-center gap-1.5 rounded-md border border-white/[0.07] bg-[#0e0f11] px-2.5">
          <Lock size={9} className="shrink-0 text-white/25" />
          <span className="truncate font-mono text-[10.5px] text-white/40">{urlLabel}</span>
        </div>
        <span className="hidden text-[10px] text-white/20 sm:inline">{device}</span>
      </div>

      <div
        className="relative flex min-h-0 flex-1 justify-center overflow-hidden bg-[#0d0e0f] p-0 sm:p-3"
        onDragOver={(event) => {
          if (event.dataTransfer.types.includes(BLOCK_MIME)) {
            event.preventDefault();
            setDragOver(true);
          }
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          const type =
            event.dataTransfer.getData(BLOCK_MIME) || event.dataTransfer.getData('text/plain');
          if (type) onDropBlock(type);
        }}
      >
        <div
          className={`h-full overflow-hidden bg-white ${DEVICE_WIDTH[device]} ${
            device === 'desktop'
              ? ''
              : 'my-0 rounded-t-lg border border-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,.8)]'
          }`}
        >
          <iframe
            key={`${activePageId}-${nonce}-${device}`}
            title="Site preview"
            srcDoc={html}
            sandbox="allow-scripts"
            className="h-full w-full border-0 bg-white"
          />
        </div>
        {dragOver ? (
          <div className="pointer-events-none absolute inset-4 z-10 flex items-center justify-center rounded-xl border-2 border-dashed border-[#8dbf9f] bg-[#8dbf9f]/10">
            <span className="rounded-full border border-[#8dbf9f]/30 bg-[#0b0c0d] px-4 py-2 text-[12px] font-medium text-[#cfe5d7] shadow-lg">
              Drop to add this section
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
