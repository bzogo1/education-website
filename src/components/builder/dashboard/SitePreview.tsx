'use client';

import { useEffect, useRef, useState } from 'react';
import { compilePageHtml } from '@/lib/site/compile';
import type { SiteProject } from '@/lib/site/types';

/**
 * Scaled-down live render of a project's first page. Uses the same compiler as
 * the published site so the dashboard never shows a fake preview.
 */
export default function SitePreview({
  project,
  className = 'aspect-[16/10]',
  pageSlug,
}: {
  project: SiteProject;
  className?: string;
  pageSlug?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const page =
    (pageSlug ? project.pages.find((candidate) => candidate.slug === pageSlug) : undefined) ??
    project.pages[0];
  const html = page ? compilePageHtml(page, project) : '';
  const scale = width > 0 ? width / 1200 : 0.25;

  return (
    <div ref={ref} className={`relative overflow-hidden bg-[#0b0c0d] ${className}`}>
      {html ? (
        <iframe
          title={`${project.title} preview`}
          srcDoc={html}
          sandbox=""
          loading="lazy"
          tabIndex={-1}
          className="pointer-events-none absolute top-0 left-0 origin-top-left border-0"
          style={{ width: 1200, height: 1400, transform: `scale(${scale})` }}
        />
      ) : (
        <div className="grid h-full place-items-center text-[11px] text-white/25">Empty page</div>
      )}
    </div>
  );
}
