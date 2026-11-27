'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Loader2, Sparkles } from 'lucide-react';
import type { ChatMessage, SiteProject } from '@/lib/site/types';

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const GREETING: ChatMessage = {
  id: 'greeting',
  role: 'assistant',
  content:
    'Tell me what to change and I will edit this portfolio directly. Try rewriting a section, adding an award, or switching the whole design.',
};

const SUGGESTIONS = [
  'Add an achievements section',
  'Rewrite my hero for a research program',
  'Switch to dark mode',
  'Add a recommendations section',
  'Make the tone more formal',
];

export default function AiPanel({
  project,
  onApplySite,
}: {
  project: SiteProject;
  onApplySite: (site: SiteProject) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  const send = async (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || sending) return;
    setInput('');
    setMessages((current) => [...current, { id: uid(), role: 'user', content: value }]);
    setSending(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'edit', message: value, document: project }),
      });
      const data = (await res.json()) as {
        reply?: string;
        site?: SiteProject;
        error?: string;
      };
      if (!res.ok || !data.site) throw new Error(data.error ?? 'The assistant could not respond.');
      onApplySite(data.site);
      setMessages((current) => [
        ...current,
        { id: uid(), role: 'assistant', content: data.reply ?? 'Done — the page is updated.' },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: uid(),
          role: 'assistant',
          content: `That did not go through: ${
            error instanceof Error ? error.message : 'unknown error'
          }. Try again?`,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' ? (
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border border-[#6fa384]/25 bg-[#6fa384]/10 text-[#a8d4b8]">
                <Sparkles size={11} />
              </span>
            ) : null}
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-[11.5px] leading-4.5 whitespace-pre-wrap ${
                message.role === 'user'
                  ? 'bg-[#d7e8dc] font-medium text-[#0d1a12]'
                  : 'border border-white/[0.06] bg-[#101113] text-white/65'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {sending ? (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#101113] px-3 py-2 text-[11px] text-white/40">
              <Loader2 size={11} className="animate-spin" /> Editing the page…
            </div>
          </div>
        ) : null}
      </div>

      <div className="shrink-0 border-t border-white/[0.07] p-3">
        <div className="mb-2 flex flex-wrap gap-1">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => void send(suggestion)}
              disabled={sending}
              className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[10px] text-white/40 transition hover:border-[#6fa384]/40 hover:text-white/80 disabled:opacity-40"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-1.5 rounded-xl border border-white/[0.09] bg-[#0b0c0d] p-1.5 focus-within:border-[#6fa384]/50">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                void send();
              }
            }}
            rows={2}
            placeholder="Describe a change…"
            aria-label="Describe a change"
            className="max-h-28 min-h-8 flex-1 resize-none bg-transparent px-1.5 py-1 text-[11.5px] leading-4 text-white/80 outline-none placeholder:text-white/25"
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={sending || !input.trim()}
            className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#d7e8dc] text-[#0d1a12] transition hover:bg-[#e6f2e9] disabled:opacity-40"
            title="Send"
            aria-label="Send"
          >
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
