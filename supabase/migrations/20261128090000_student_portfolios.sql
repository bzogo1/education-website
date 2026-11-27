-- Student portfolio sites, public URLs, and lightweight view analytics.
--
-- Publishing works like this:
--   * a signed-in student owns rows by user_id (RLS below)
--   * guests can publish through /api/publish with a generated owner_username
--   * /u/[owner_username]/[slug] reads published rows only
--
-- Apply with: supabase db push   (or paste into the Supabase SQL editor)

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.sites (
  id text primary key,
  user_id uuid references auth.users (id) on delete cascade,
  owner_username text not null,
  title text not null,
  description text,
  slug text not null,
  source text not null default 'elements' check (source in ('template', 'ai', 'elements')),
  accent text not null default '#2f6f4e',
  theme jsonb not null default '{"mode":"light","font":"sans"}'::jsonb,
  pages jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists sites_public_path_idx
  on public.sites (lower(owner_username), slug);

create index if not exists sites_owner_idx
  on public.sites (user_id, updated_at desc);

create index if not exists sites_published_idx
  on public.sites (published, published_at desc)
  where published;

alter table public.sites enable row level security;

grant select, insert, update, delete on public.sites to authenticated;
grant select on public.sites to anon;

drop policy if exists sites_owner_select on public.sites;
create policy sites_owner_select
  on public.sites
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists sites_owner_insert on public.sites;
create policy sites_owner_insert
  on public.sites
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists sites_owner_update on public.sites;
create policy sites_owner_update
  on public.sites
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists sites_owner_delete on public.sites;
create policy sites_owner_delete
  on public.sites
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists sites_public_read on public.sites;
create policy sites_public_read
  on public.sites
  for select
  to anon, authenticated
  using (published);

drop trigger if exists sites_set_updated_at on public.sites;
create trigger sites_set_updated_at
  before update on public.sites
  for each row execute function public.set_updated_at();

-- One row per page view. Writes only happen through the service role.
create table if not exists public.site_views (
  id bigint generated always as identity primary key,
  site_id text not null references public.sites (id) on delete cascade,
  viewed_at timestamptz not null default now(),
  referrer text
);

create index if not exists site_views_site_time_idx
  on public.site_views (site_id, viewed_at desc);

alter table public.site_views enable row level security;

grant select on public.site_views to authenticated;

drop policy if exists site_views_owner_read on public.site_views;
create policy site_views_owner_read
  on public.site_views
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.sites s
      where s.id = site_views.site_id
        and s.user_id = (select auth.uid())
    )
  );

-- Public portfolio profile fields.
alter table public.profiles
  add column if not exists headline text,
  add column if not exists school text,
  add column if not exists graduation_year text,
  add column if not exists location text,
  add column if not exists bio text,
  add column if not exists avatar_url text,
  add column if not exists links jsonb not null default '[]'::jsonb;
