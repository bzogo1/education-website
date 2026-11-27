'use client';

import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, BarChart3, Eye, Globe2, Minus } from 'lucide-react';
import type { AnalyticsSummary } from '@/lib/site/types';
import type { ViewKey } from './Shell';
import { Badge, EmptyState, SectionHeader, StatCard, BTN_PRIMARY } from './ui';

function formatDay(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function delta(
  current: number,
  previous: number
): { label: string; direction: 'up' | 'down' | 'flat' } {
  if (previous === 0 && current === 0) return { label: 'No change', direction: 'flat' };
  if (previous === 0) return { label: 'New traffic', direction: 'up' };
  const change = Math.round(((current - previous) / previous) * 100);
  return {
    label: `${change > 0 ? '+' : ''}${change}% vs previous 7 days`,
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'flat',
  };
}

export default function AnalyticsView({
  summary,
  loading,
  available,
  error,
  onNavigate,
}: {
  summary: AnalyticsSummary | null;
  loading: boolean;
  available: boolean;
  error: string | null;
  onNavigate: (view: ViewKey) => void;
}) {
  if (!summary) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="font-serif text-[28px] leading-tight font-semibold tracking-[-0.025em]">
            Analytics
          </h1>
          <p className="mt-1.5 text-[13px] text-white/45">
            See which portfolios get opened and which links are working.
          </p>
        </div>
        {loading ? (
          <div className="rounded-2xl border border-white/[0.07] bg-[#101113] p-10 text-center text-[12px] text-white/35">
            Loading analytics…
          </div>
        ) : (
          <EmptyState
            icon={<BarChart3 size={19} />}
            title="No analytics yet"
            description="Views are counted once a portfolio is published and someone opens the link. Sign in to keep your data with your account."
            action={
              <Link href="/signup" className={BTN_PRIMARY}>
                <Globe2 size={13} /> Publish your first portfolio
              </Link>
            }
          />
        )}
      </div>
    );
  }

  const trend = delta(summary.viewsLast7, summary.viewsPrevious7);
  const max = Math.max(1, ...summary.series.map((point) => point.views));
  const activeDays = summary.series.filter((point) => point.views > 0).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[28px] leading-tight font-semibold tracking-[-0.025em]">
            Analytics
          </h1>
          <p className="mt-1.5 text-[13px] text-white/45">
            Last 30 days across every published portfolio. No cookies, just page views.
          </p>
        </div>
        <button type="button" onClick={() => onNavigate('published')} className={BTN_PRIMARY}>
          <Globe2 size={13} /> Manage published
        </button>
      </div>

      {!available ? (
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.05] px-4 py-3 text-[11.5px] leading-5 text-amber-100/70">
          Analytics storage is not set up yet.
          {error ? ` ${error}` : ' Run the student_portfolios migration to enable view tracking.'}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Views · 30 days"
          value={summary.totalViews.toLocaleString()}
          hint={`${activeDays} active day${activeDays === 1 ? '' : 's'}`}
          icon={<Eye size={15} />}
          accent
        />
        <StatCard
          label="Last 7 days"
          value={summary.viewsLast7.toLocaleString()}
          hint={trend.label}
          icon={
            trend.direction === 'up' ? (
              <ArrowUpRight size={15} className="text-emerald-300/70" />
            ) : trend.direction === 'down' ? (
              <ArrowDownRight size={15} className="text-red-300/70" />
            ) : (
              <Minus size={15} />
            )
          }
        />
        <StatCard
          label="Published sites"
          value={summary.published}
          hint={`of ${summary.projects} project${summary.projects === 1 ? '' : 's'}`}
          icon={<Globe2 size={15} />}
        />
        <StatCard
          label="Best performer"
          value={summary.sites[0]?.views ? summary.sites[0].views.toLocaleString() : '—'}
          hint={summary.sites[0]?.title ?? 'Publish a site to compare'}
          icon={<BarChart3 size={15} />}
        />
      </div>

      <section className="rounded-2xl border border-white/[0.07] bg-[#101113] p-5">
        <SectionHeader
          title="Views over time"
          description="Daily page views for the last 30 days."
          action={
            <span className="inline-flex items-center gap-1.5 text-[10.5px] text-white/30">
              <span className="size-2 rounded-sm bg-[#8dbf9f]" /> page views
            </span>
          }
        />
        <div className="mt-6">
          {summary.totalViews === 0 ? (
            <div className="grid h-36 place-items-center rounded-xl border border-dashed border-white/[0.08] text-[11.5px] text-white/30">
              No views recorded yet — share a published link to start the chart.
            </div>
          ) : (
            <>
              <div className="flex h-36 items-end gap-[3px]">
                {summary.series.map((point) => (
                  <div
                    key={point.date}
                    title={`${formatDay(point.date)}: ${point.views} view${point.views === 1 ? '' : 's'}`}
                    className="group relative flex-1 rounded-t-[3px] bg-gradient-to-t from-[#2d5341] to-[#8dbf9f] transition hover:from-[#356349] hover:to-[#b6dcc3]"
                    style={{
                      height: `${Math.max(point.views === 0 ? 2 : 8, (point.views / max) * 100)}%`,
                      opacity: point.views === 0 ? 0.25 : 1,
                    }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-white/25">
                <span>{formatDay(summary.series[0]?.date ?? '')}</span>
                <span>
                  {formatDay(summary.series[Math.floor(summary.series.length / 2)]?.date ?? '')}
                </span>
                <span>{formatDay(summary.series[summary.series.length - 1]?.date ?? '')}</span>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101113]">
        <div className="border-b border-white/[0.06] p-5 pb-4">
          <SectionHeader title="By site" description="Compare the portfolios you have published." />
        </div>
        {summary.sites.length === 0 ? (
          <div className="px-5 py-10 text-center text-[12px] text-white/35">
            No projects to compare yet.
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {summary.sites.map((site) => (
              <li key={site.id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[12.5px] font-medium text-white/80">{site.title}</p>
                    {site.published ? <Badge tone="live">Live</Badge> : <Badge>Draft</Badge>}
                  </div>
                  {site.publishedUrl ? (
                    <p className="mt-0.5 truncate text-[10.5px] text-white/30">
                      {site.publishedUrl.replace(/^https?:\/\/[^/]+/, '')}
                    </p>
                  ) : (
                    <p className="mt-0.5 text-[10.5px] text-white/25">Not published</p>
                  )}
                </div>
                <div className="w-24 shrink-0">
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-[#8dbf9f]"
                      style={{
                        width: `${Math.min(100, (site.views / Math.max(1, summary.sites[0].views)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="w-14 shrink-0 text-right text-[12px] text-white/60 tabular-nums">
                  {site.views.toLocaleString()}
                </span>
                {site.publishedUrl ? (
                  <a
                    href={site.publishedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden rounded-lg border border-white/[0.09] px-2 py-1 text-[10.5px] text-white/50 transition hover:border-white/20 hover:text-white sm:inline-flex"
                  >
                    Open
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
