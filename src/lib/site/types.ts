export type BlockType =
  | 'navbar'
  | 'hero'
  | 'stats'
  | 'about'
  | 'education'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'achievements'
  | 'gallery'
  | 'image'
  | 'text'
  | 'testimonials'
  | 'cta'
  | 'contact'
  | 'footer'
  // Kept for projects created before the academic block set existed.
  | 'features'
  | 'pricing';

export interface SiteBlock {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
}

export interface SitePage {
  id: string;
  name: string;
  slug: string;
  blocks: SiteBlock[];
}

export type ProjectSource = 'template' | 'ai' | 'elements';

export type SiteThemeMode = 'light' | 'dark';
export type SiteHeadingFont = 'sans' | 'serif';

export interface SiteTheme {
  mode: SiteThemeMode;
  font: SiteHeadingFont;
}

export interface SiteProject {
  id: string;
  title: string;
  description?: string;
  slug: string;
  source: ProjectSource;
  createdAt: string;
  updatedAt: string;
  /** Absolute URL of the published site, if it has been published. */
  publishedUrl?: string;
  publishedAt?: string;
  /** Public handle used in /u/[handle]/[slug]. */
  handle?: string;
  /** Lifetime views, filled in by the projects API. */
  views?: number;
  accent: string;
  theme: SiteTheme;
  pages: SitePage[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface StudentLink {
  label: string;
  url: string;
}

export interface StudentProfile {
  username: string;
  firstName: string | null;
  lastName: string | null;
  headline: string | null;
  school: string | null;
  graduationYear: string | null;
  location: string | null;
  bio: string | null;
  avatarUrl: string | null;
  links: StudentLink[];
}

export interface AnalyticsPoint {
  date: string;
  views: number;
}

export interface SiteAnalytics {
  id: string;
  title: string;
  slug: string;
  publishedUrl?: string;
  published: boolean;
  views: number;
  last7: number;
}

export interface AnalyticsSummary {
  totalViews: number;
  viewsLast7: number;
  viewsPrevious7: number;
  series: AnalyticsPoint[];
  sites: SiteAnalytics[];
  published: number;
  projects: number;
}
