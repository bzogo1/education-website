import { normalizeProject, slugify } from './project';
import type { SiteProject, StudentLink, StudentProfile } from './types';

export const SITE_COLUMNS =
  'id,user_id,owner_username,title,description,slug,source,accent,theme,pages,published,published_at,created_at,updated_at';

export interface SiteRow {
  id: string;
  user_id: string | null;
  owner_username: string;
  title: string;
  description: string | null;
  slug: string;
  source: string;
  accent: string;
  theme: unknown;
  pages: unknown;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export function rowToProject(row: SiteRow, origin?: string): SiteProject {
  const project = normalizeProject({
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    slug: row.slug,
    source: (row.source as SiteProject['source']) ?? 'elements',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    accent: row.accent,
    theme: row.theme as SiteProject['theme'],
    pages: row.pages as SiteProject['pages'],
    publishedAt: row.published_at ?? undefined,
    handle: row.owner_username,
  });
  if (row.published && origin) {
    project.publishedUrl = `${origin}/u/${row.owner_username}/${row.slug}`;
  }
  return project;
}

export function projectSlug(project: Pick<SiteProject, 'slug' | 'title'>): string {
  return slugify(project.slug || project.title, 'portfolio');
}

export const PROFILE_COLUMNS =
  'username,first_name,last_name,headline,school,graduation_year,location,bio,avatar_url,links';

export interface ProfileRow {
  username: string;
  first_name: string | null;
  last_name: string | null;
  headline: string | null;
  school: string | null;
  graduation_year: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
  links: unknown;
}

export function sanitizeLinks(value: unknown): StudentLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((link): link is Record<string, unknown> => Boolean(link && typeof link === 'object'))
    .map((link) => ({
      label: String(link.label ?? '')
        .trim()
        .slice(0, 40),
      url: String(link.url ?? link.href ?? '')
        .trim()
        .slice(0, 300),
    }))
    .filter((link) => link.label.length > 0 && link.url.length > 0)
    .slice(0, 8);
}

export function rowToProfile(row: ProfileRow): StudentProfile {
  return {
    username: row.username,
    firstName: row.first_name,
    lastName: row.last_name,
    headline: row.headline,
    school: row.school,
    graduationYear: row.graduation_year,
    location: row.location,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    links: sanitizeLinks(row.links),
  };
}

export function displayNameOf(
  profile: Pick<StudentProfile, 'firstName' | 'lastName' | 'username'>
): string {
  const full = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim();
  return full || profile.username;
}

export function cleanText(value: unknown, max = 200): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}
