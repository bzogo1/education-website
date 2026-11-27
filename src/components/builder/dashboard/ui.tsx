'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Check, Copy, X } from 'lucide-react';

export const PANEL = 'rounded-2xl border border-white/[0.07] bg-[#101113]';
export const INPUT =
  'w-full rounded-xl border border-white/[0.09] bg-[#0b0c0d] px-3.5 py-2.5 text-[13.5px] text-[#f2f1ec] outline-none transition placeholder:text-white/25 focus:border-[#6fa384] focus:ring-2 focus:ring-[#6fa384]/15';
export const LABEL = 'mb-1.5 block text-[11px] font-medium tracking-wide text-white/45';
export const BTN_PRIMARY =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#d7e8dc] px-4 py-2.5 text-[13px] font-semibold text-[#0d1a12] transition hover:bg-[#e6f2e9] disabled:cursor-not-allowed disabled:opacity-50';
export const BTN_GHOST =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] px-3.5 py-2 text-[13px] font-medium text-white/70 transition hover:border-white/20 hover:text-white';

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#f2f1ec]">{title}</h2>
        {description ? <p className="mt-1 text-[12.5px] text-white/40">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 ${
        accent
          ? 'border-[#6fa384]/25 bg-[#11170f]'
          : 'border-white/[0.07] bg-[#101113]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-medium tracking-[0.09em] text-white/40 uppercase">{label}</p>
        {icon ? <span className="text-white/25">{icon}</span> : null}
      </div>
      <p className="mt-3 font-serif text-[28px] leading-none font-semibold tracking-[-0.02em] text-[#f5f4ef]">
        {value}
      </p>
      {hint ? <p className="mt-2.5 text-[11.5px] leading-4 text-white/35">{hint}</p> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'live' | 'warn' | 'accent';
}) {
  const tones: Record<string, string> = {
    neutral: 'border-white/10 bg-white/[0.04] text-white/50',
    live: 'border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-200/90',
    warn: 'border-amber-400/20 bg-amber-400/[0.07] text-amber-200/80',
    accent: 'border-[#6fa384]/30 bg-[#6fa384]/10 text-[#a8d4b8]',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function IconButton({
  label,
  onClick,
  children,
  danger,
  disabled,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid size-8 place-items-center rounded-lg border border-transparent text-white/40 transition hover:border-white/10 hover:bg-white/[0.05] hover:text-white disabled:opacity-30 ${
        danger ? 'hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-300' : ''
      }`}
    >
      {children}
    </button>
  );
}

export function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          setCopied(false);
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-2.5 py-1.5 text-[11.5px] font-medium text-white/60 transition hover:border-white/20 hover:text-white"
    >
      {copied ? <Check size={12} className="text-emerald-300" /> : <Copy size={12} />}
      {copied ? 'Copied' : label}
    </button>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#4d7f61] to-[#a8d4b8] transition-[width] duration-700"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.09] bg-[#0d0e0f] px-6 py-16 text-center">
      <div className="grid size-11 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/35">
        {icon}
      </div>
      <h3 className="mt-4 text-sm font-semibold text-[#f2f1ec]">{title}</h3>
      <p className="mt-1.5 max-w-sm text-[12.5px] leading-5 text-white/40">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative z-10 flex max-h-[88vh] w-full flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0d0e0f] shadow-2xl ${
          wide ? 'max-w-5xl' : 'max-w-lg'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-3.5">
          <h2 className="text-sm font-semibold text-[#f2f1ec]">{title}</h2>
          <IconButton label="Close" onClick={onClose}>
            <X size={15} />
          </IconButton>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
