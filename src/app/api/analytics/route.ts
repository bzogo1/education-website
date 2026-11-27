import { NextRequest, NextResponse } from 'next/server';
import {
  appOrigin,
  getAdminClient,
  getUserFromRequest,
  isMissingSchema,
} from '@/lib/supabase/admin';
import type { AnalyticsPoint, AnalyticsSummary, SiteAnalytics } from '@/lib/site/types';

export const runtime = 'nodejs';

const WINDOW_DAYS = 30;

function emptySummary(): AnalyticsSummary {
  const series: AnalyticsPoint[] = Array.from({ length: WINDOW_DAYS }, (_, index) => {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - (WINDOW_DAYS - 1 - index));
    return { date: date.toISOString().slice(0, 10), views: 0 };
  });
  return {
    totalViews: 0,
    viewsLast7: 0,
    viewsPrevious7: 0,
    series,
    sites: [],
    published: 0,
    projects: 0,
  };
}

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ available: false, summary: emptySummary() }, { status: 401 });
  }
  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json({ available: false, summary: emptySummary() }, { status: 503 });
  }

  const { data: siteRows, error: sitesError } = await admin
    .from('sites')
    .select('id,title,slug,owner_username,published,published_at')
    .eq('user_id', user.id);

  if (sitesError) {
    return NextResponse.json({
      available: false,
      summary: emptySummary(),
      error: isMissingSchema(sitesError)
        ? 'Run the student_portfolios migration to enable analytics.'
        : sitesError.message,
    });
  }

  const sites = (siteRows ?? []) as {
    id: string;
    title: string;
    slug: string;
    owner_username: string;
    published: boolean;
    published_at: string | null;
  }[];

  const summary = emptySummary();
  summary.projects = sites.length;
  summary.published = sites.filter((site) => site.published).length;

  const ids = sites.map((site) => site.id);
  const origin = appOrigin(request);
  const since = new Date(Date.now() - WINDOW_DAYS * 86_400_000);
  const byDate = new Map(summary.series.map((point) => [point.date, point]));
  const perSite = new Map<string, number>();

  if (ids.length > 0) {
    const { data: viewRows, error: viewsError } = await admin
      .from('site_views')
      .select('site_id,viewed_at')
      .in('site_id', ids)
      .gte('viewed_at', since.toISOString())
      .limit(50_000);

    if (!viewsError) {
      for (const view of (viewRows ?? []) as { site_id: string; viewed_at: string }[]) {
        const date = view.viewed_at.slice(0, 10);
        const point = byDate.get(date);
        if (point) point.views += 1;
        perSite.set(view.site_id, (perSite.get(view.site_id) ?? 0) + 1);
      }
    }
  }

  summary.totalViews = summary.series.reduce((sum, point) => sum + point.views, 0);
  summary.viewsLast7 = summary.series.slice(-7).reduce((sum, point) => sum + point.views, 0);
  summary.viewsPrevious7 = summary.series
    .slice(-14, -7)
    .reduce((sum, point) => sum + point.views, 0);

  const analyticsSites: SiteAnalytics[] = sites
    .map((site) => ({
      id: site.id,
      title: site.title,
      slug: site.slug,
      published: site.published,
      publishedUrl: site.published ? `${origin}/u/${site.owner_username}/${site.slug}` : undefined,
      views: perSite.get(site.id) ?? 0,
      last7: 0,
    }))
    .sort((a, b) => b.views - a.views);

  summary.sites = analyticsSites;
  return NextResponse.json({ available: true, summary });
}
