'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import {
  ArrowUpRight,
  BarChart3,
  Cloud,
  FolderKanban,
  Globe2,
  HardDrive,
  LayoutDashboard,
  LayoutTemplate,
  LogIn,
  LogOut,
  Menu,
  Plus,
  Settings2,
  X,
} from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Viewer } from '@/lib/supabase/use-user';
import type { WorkspaceMode } from '@/lib/site/store';

export type ViewKey =
  | 'overview'
  | 'projects'
  | 'templates'
  | 'published'
  | 'analytics'
  | 'settings';

const NAV: { key: ViewKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'templates', label: 'Templates', icon: LayoutTemplate },
  { key: 'published', label: 'Published', icon: Globe2 },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings2 },
];

function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-[11px] bg-gradient-to-b from-[#e2f0e6] to-[#b9d6c3] font-serif text-[17px] font-bold text-[#0f2518] shadow-[0_6px_18px_-10px_rgba(200,240,210,.6)]">
        F
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-[-0.01em] text-[#f5f4ef]">
          Folio
        </span>
        <span className="block text-[10.5px] tracking-[0.13em] text-white/35 uppercase">
          Student portfolios
        </span>
      </span>
    </Link>
  );
}

function NavList({
  active,
  projectCount,
  publishedCount,
  onNavigate,
}: {
  active: ViewKey;
  projectCount: number;
  publishedCount: number;
  onNavigate: (view: ViewKey) => void;
}) {
  const counts: Partial<Record<ViewKey, number>> = {
    projects: projectCount,
    published: publishedCount,
  };
  return (
    <nav className="flex flex-col gap-0.5" aria-label="Workspace">
      {NAV.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onNavigate(key)}
            aria-current={isActive ? 'page' : undefined}
            className={`group flex items-center gap-2.5 rounded-[9px] px-2.5 py-[7px] text-left text-[13px] transition ${
              isActive
                ? 'bg-white/[0.07] font-medium text-[#f5f4ef]'
                : 'text-white/50 hover:bg-white/[0.03] hover:text-white/85'
            }`}
          >
            <Icon
              size={15}
              strokeWidth={1.7}
              className={isActive ? 'text-[#a8d4b8]' : 'text-white/35 group-hover:text-white/60'}
            />
            <span className="flex-1">{label}</span>
            {typeof counts[key] === 'number' && counts[key]! > 0 ? (
              <span className="text-[10.5px] text-white/30 tabular-nums">{counts[key]}</span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

function WorkspaceCard({ mode, signedIn }: { mode: WorkspaceMode; signedIn: boolean }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
      <div className="flex items-center gap-2 text-[11.5px] font-medium text-white/70">
        {mode === 'cloud' ? (
          <Cloud size={13} className="text-[#a8d4b8]" />
        ) : (
          <HardDrive size={13} className="text-white/40" />
        )}
        {mode === 'cloud' ? 'Cloud workspace' : 'Local workspace'}
      </div>
      <p className="mt-1 text-[11px] leading-4 text-white/35">
        {mode === 'cloud'
          ? 'Every edit is saved to your account.'
          : signedIn
            ? 'Saved in this browser. Cloud storage is not set up yet.'
            : 'Saved in this browser only.'}
      </p>
      {mode === 'local' && !signedIn ? (
        <Link
          href="/signup"
          className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#a8d4b8] transition hover:text-[#d3eadb]"
        >
          <LogIn size={11} /> Sign in to sync
        </Link>
      ) : null}
    </div>
  );
}

function UserCard({ viewer }: { viewer: Viewer }) {
  const signOut = async () => {
    try {
      await getSupabaseBrowserClient().auth.signOut();
      window.location.href = '/';
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#1d2a22] text-[11px] font-semibold text-[#bfe0cb]">
        {viewer.initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-medium text-white/80">{viewer.displayName}</p>
        <p className="truncate text-[10.5px] text-white/35">
          {viewer.username ? `@${viewer.username}` : 'Guest session'}
        </p>
      </div>
      {viewer.user ? (
        <button
          type="button"
          onClick={signOut}
          title="Sign out"
          aria-label="Sign out"
          className="grid size-7 place-items-center rounded-lg text-white/30 transition hover:bg-white/[0.05] hover:text-white/80"
        >
          <LogOut size={13} />
        </button>
      ) : (
        <Link
          href="/signup"
          title="Sign in"
          aria-label="Sign in"
          className="grid size-7 place-items-center rounded-lg text-white/30 transition hover:bg-white/[0.05] hover:text-white/80"
        >
          <LogIn size={13} />
        </Link>
      )}
    </div>
  );
}

export default function Shell({
  viewer,
  mode,
  active,
  projectCount,
  publishedCount,
  onNavigate,
  onNewSite,
  children,
}: {
  viewer: Viewer;
  mode: WorkspaceMode;
  active: ViewKey;
  projectCount: number;
  publishedCount: number;
  onNavigate: (view: ViewKey) => void;
  onNewSite: () => void;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeLabel = NAV.find((item) => item.key === active)?.label ?? 'Overview';

  const sidebar = (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-3 py-5">
        <div className="px-1.5">
          <Brand />
        </div>
        <div>
          <p className="mb-2 px-2.5 text-[10px] font-semibold tracking-[0.14em] text-white/25 uppercase">
            Workspace
          </p>
          <NavList
            active={active}
            projectCount={projectCount}
            publishedCount={publishedCount}
            onNavigate={(view) => {
              onNavigate(view);
              setMobileOpen(false);
            }}
          />
        </div>
        <div className="mt-auto space-y-3">
          <WorkspaceCard mode={mode} signedIn={Boolean(viewer.user)} />
          <UserCard viewer={viewer} />
        </div>
      </div>
      <div className="border-t border-white/[0.06] px-3 py-3">
        <Link
          href="/"
          className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[11.5px] text-white/35 transition hover:bg-white/[0.03] hover:text-white/70"
        >
          Back to the main site <ArrowUpRight size={12} />
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-dvh bg-[#08090a] text-[#f2f1ec] [font-synthesis:none]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[236px] flex-col border-r border-white/[0.06] bg-[#090a0b] lg:flex">
        {sidebar}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-[268px] flex-col border-r border-white/[0.08] bg-[#090a0b]">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-3 grid size-8 place-items-center rounded-lg text-white/40 hover:bg-white/[0.05] hover:text-white"
            >
              <X size={15} />
            </button>
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-[236px]">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-white/[0.06] bg-[#08090a]/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="grid size-8 place-items-center rounded-lg text-white/50 hover:bg-white/[0.05] hover:text-white lg:hidden"
          >
            <Menu size={17} />
          </button>
          <div className="flex min-w-0 items-center gap-1.5 text-[12px]">
            <span className="hidden text-white/30 sm:inline">Workspace</span>
            <span className="hidden text-white/20 sm:inline">/</span>
            <span className="truncate font-medium text-white/65">{activeLabel}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-lg border border-white/[0.09] px-3 py-1.5 text-[12px] text-white/55 transition hover:border-white/20 hover:text-white sm:inline-flex"
            >
              Main site
            </Link>
            <button
              type="button"
              onClick={onNewSite}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#d7e8dc] px-3 py-1.5 text-[12px] font-semibold text-[#0d1a12] transition hover:bg-[#e6f2e9]"
            >
              <Plus size={13} /> New site
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
