import type { SitePage, SiteProject, SiteTheme, StudentProfile } from './types';

function randomToken(): string {
  if (typeof crypto === 'undefined') {
    throw new Error('A secure random source is required.');
  }
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function newId(prefix = ''): string {
  const raw = randomToken();
  return prefix ? `${prefix}_${raw}` : raw;
}

export function slugify(value: string, fallback = 'site'): string {
  const slug = value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    .slice(0, 60);
  return slug || fallback;
}

export function uniqueSlug(base: string, taken: Iterable<string>): string {
  const used = new Set(taken);
  if (!used.has(base)) return base;
  let i = 2;
  while (used.has(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

export const DEFAULT_THEME: SiteTheme = { mode: 'light', font: 'sans' };
export const DEFAULT_ACCENT = '#2f6f4e';

export function normalizeTheme(theme: unknown): SiteTheme {
  const value = (theme ?? {}) as Partial<SiteTheme>;
  return {
    mode: value.mode === 'dark' ? 'dark' : 'light',
    font: value.font === 'serif' ? 'serif' : 'sans',
  };
}

function normalizePage(page: Partial<SitePage>): SitePage {
  const blocks = Array.isArray(page.blocks)
    ? page.blocks.filter((b): b is SitePage['blocks'][number] =>
        Boolean(b && typeof b === 'object')
      )
    : [];
  const name = typeof page.name === 'string' && page.name.trim() ? page.name : 'Home';
  return {
    id: typeof page.id === 'string' && page.id ? page.id : newId('page'),
    name,
    slug: typeof page.slug === 'string' && page.slug ? page.slug : slugify(name),
    blocks: blocks.map((block, index) => ({
      id: typeof block.id === 'string' && block.id ? block.id : `b_${index}`,
      type: block.type,
      props: block.props && typeof block.props === 'object' ? block.props : {},
    })),
  };
}

/** Fills in fields added after a project was saved (older local projects). */
export function normalizeProject(project: Partial<SiteProject> & { id: string }): SiteProject {
  const now = new Date().toISOString();
  const pages = Array.isArray(project.pages) ? project.pages.map(normalizePage) : [];
  const title =
    typeof project.title === 'string' && project.title.trim() ? project.title : 'Untitled site';
  return {
    id: project.id,
    title,
    description: typeof project.description === 'string' ? project.description : undefined,
    slug: typeof project.slug === 'string' && project.slug ? project.slug : slugify(title),
    source:
      project.source === 'template' || project.source === 'ai' || project.source === 'elements'
        ? project.source
        : 'elements',
    createdAt: typeof project.createdAt === 'string' ? project.createdAt : now,
    updatedAt: typeof project.updatedAt === 'string' ? project.updatedAt : now,
    publishedUrl: typeof project.publishedUrl === 'string' ? project.publishedUrl : undefined,
    publishedAt: typeof project.publishedAt === 'string' ? project.publishedAt : undefined,
    handle: typeof project.handle === 'string' ? project.handle : undefined,
    views: typeof project.views === 'number' ? project.views : undefined,
    accent: typeof project.accent === 'string' && project.accent ? project.accent : DEFAULT_ACCENT,
    theme: normalizeTheme(project.theme),
    pages:
      pages.length > 0
        ? pages
        : [
            {
              id: newId('page'),
              name: 'Home',
              slug: 'home',
              blocks: [],
            },
          ],
  };
}

export function emptyProject(title = 'Untitled site'): SiteProject {
  const now = new Date().toISOString();
  return {
    id: newId('p'),
    title,
    slug: slugify(title),
    source: 'elements',
    createdAt: now,
    updatedAt: now,
    accent: DEFAULT_ACCENT,
    theme: { ...DEFAULT_THEME },
    pages: [{ id: newId('page'), name: 'Home', slug: 'home', blocks: [] }],
  };
}

const PROFILE_FIELDS: (keyof StudentProfile)[] = [
  'firstName',
  'lastName',
  'headline',
  'school',
  'graduationYear',
  'location',
  'bio',
  'avatarUrl',
  'links',
];

/** Percentage of the profile a visitor can actually see something useful from. */
export function profileCompleteness(profile: StudentProfile | null): number {
  if (!profile) return 0;
  const filled = PROFILE_FIELDS.filter((key) => {
    const value = profile[key];
    if (key === 'links') return Array.isArray(value) && value.length > 0;
    if (key === 'avatarUrl') return false;
    return typeof value === 'string' && value.trim().length > 0;
  }).length;
  return Math.round((filled / (PROFILE_FIELDS.length - 1)) * 100);
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 'just now';
  const diff = Date.now() - then;
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
