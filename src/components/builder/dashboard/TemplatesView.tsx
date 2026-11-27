'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Layers, Loader2, Sparkles } from 'lucide-react';
import { SITE_TEMPLATES, type SiteTemplate } from '@/lib/site/templates';
import type { SiteProject } from '@/lib/site/types';
import SitePreview from './SitePreview';
import { Modal, Badge, LABEL, BTN_GHOST, BTN_PRIMARY } from './ui';

const SUGGESTIONS = [
  'Research portfolio for a biology student',
  'Humanities portfolio with essays and debate',
  'Studio art portfolio with a gallery',
  'Scholar-athlete recruiting page',
];

export default function TemplatesView({
  onCreateFromTemplate,
  onCreateFromPrompt,
}: {
  onCreateFromTemplate: (templateId: string) => void;
  onCreateFromPrompt: (prompt: string) => Promise<string | null>;
}) {
  const previews = useMemo(
    () => SITE_TEMPLATES.map((template) => ({ template, project: template.build() })),
    []
  );
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(SITE_TEMPLATES.map((template) => template.category)))],
    []
  );
  const [category, setCategory] = useState('All');
  const [preview, setPreview] = useState<{ template: SiteTemplate; project: SiteProject } | null>(
    null
  );
  const [prompt, setPrompt] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visible =
    category === 'All'
      ? previews
      : previews.filter((item) => item.template.category === category);

  const build = async (text?: string) => {
    const value = (text ?? prompt).trim();
    if (!value || sending) return;
    setSending(true);
    setError(null);
    try {
      const id = await onCreateFromPrompt(value);
      if (!id) setError('Could not build that portfolio. Try again in a moment.');
      else setPrompt('');
    } catch {
      setError('Could not build that portfolio. Try again in a moment.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-[28px] leading-tight font-semibold tracking-[-0.025em]">
          Start a portfolio
        </h1>
        <p className="mt-1.5 max-w-2xl text-[13px] leading-5 text-white/45">
          Templates are real student structures — every block is editable, and nothing is locked in.
          Pick a starting point or describe what you need.
        </p>
      </div>

      <section className="relative overflow-hidden rounded-2xl border border-[#6fa384]/20 bg-[#0e1310] p-5 sm:p-6">
        <div
          className="pointer-events-none absolute -top-24 right-0 h-56 w-56 rounded-full opacity-50 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, #3d6b53, transparent)' }}
        />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg border border-[#a8d4b8]/20 bg-[#a8d4b8]/10 text-[#a8d4b8]">
                <Sparkles size={13} />
              </span>
              <p className="text-[11px] font-semibold tracking-[0.13em] text-[#a8d4b8] uppercase">
                Build from a prompt
              </p>
            </div>
            <label htmlFor="template-prompt" className={LABEL + ' mt-3'}>
              What is this portfolio for?
            </label>
            <textarea
              id="template-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void build();
                }
              }}
              rows={2}
              placeholder="A research portfolio for a student who did computational biology and won a regional science fair"
              className="w-full resize-none rounded-xl border border-white/[0.09] bg-[#0a0c0b] px-3.5 py-2.5 text-[13px] leading-5 text-[#f2f1ec] outline-none placeholder:text-white/25 focus:border-[#6fa384]"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={sending}
                  onClick={() => {
                    setPrompt(suggestion);
                    void build(suggestion);
                  }}
                  className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[10.5px] text-white/40 transition hover:border-[#6fa384]/40 hover:text-white/75 disabled:opacity-40"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            {error ? <p className="mt-2 text-[12px] text-red-300/90">{error}</p> : null}
          </div>
          <button
            type="button"
            onClick={() => void build()}
            disabled={sending || !prompt.trim()}
            className={BTN_PRIMARY + ' shrink-0'}
          >
            {sending ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
            {sending ? 'Building…' : 'Build it'}
          </button>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition ${
                category === item
                  ? 'border-white/20 bg-white/[0.08] text-white'
                  : 'border-white/[0.07] text-white/40 hover:border-white/15 hover:text-white/70'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-white/30">{visible.length} templates</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map(({ template, project }) => (
          <article
            key={template.id}
            className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101113] transition hover:border-white/[0.16]"
          >
            <button
              type="button"
              onClick={() => setPreview({ template, project })}
              className="relative block w-full cursor-pointer text-left"
              aria-label={`Preview ${template.name}`}
            >
              <SitePreview project={project} className="aspect-[16/10]" />
              <span className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                <span className="rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-black">
                  Preview
                </span>
              </span>
            </button>
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-[13px] font-medium text-white/85">{template.name}</h2>
                <Badge>{template.category}</Badge>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-4.5 text-white/40">
                {template.description}
              </p>
              <button
                type="button"
                onClick={() => onCreateFromTemplate(template.id)}
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/[0.09] py-2 text-[11.5px] font-medium text-white/70 transition hover:border-[#6fa384]/40 hover:bg-[#a8d4b8]/[0.06] hover:text-white"
              >
                Use this template <ArrowRight size={11} />
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#0d0f10] px-4 py-3 text-[11.5px] text-white/35">
        <Layers size={13} className="shrink-0 text-white/25" />
        Every template includes a working navigation, responsive layout, and print styles. Duplicate
        a project to tailor one portfolio per application.
      </div>

      <Modal
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        title={preview ? `${preview.template.name} preview` : 'Preview'}
        wide
      >
        {preview ? (
          <div>
            <SitePreview project={preview.project} className="aspect-[16/10]" />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] p-4">
              <div>
                <p className="text-[12.5px] font-medium text-white/80">{preview.template.name}</p>
                <p className="mt-0.5 text-[11px] text-white/35">{preview.template.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setPreview(null)} className={BTN_GHOST}>
                  Keep browsing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onCreateFromTemplate(preview.template.id);
                    setPreview(null);
                  }}
                  className={BTN_PRIMARY}
                >
                  Use this template
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
