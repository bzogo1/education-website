create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  first_name text,
  last_name text,
  newsletter_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index profiles_username_lower_idx
  on public.profiles (lower(username));

alter table public.profiles enable row level security;

grant select, update on public.profiles to authenticated;

create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

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

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  uname text;
  base text;
  attempt int := 0;
begin
  uname := nullif(btrim(coalesce(meta ->> 'username', '')), '');

  if uname is null then
    base := regexp_replace(split_part(coalesce(new.email, ''), '@', 1), '[^a-zA-Z0-9_]', '', 'g');
    if base = '' then
      base := 'user';
    end if;
    base := left(base, 20);
    uname := base;

    while exists (
      select 1 from public.profiles p where lower(p.username) = lower(uname)
    ) loop
      attempt := attempt + 1;
      if attempt > 50 then
        uname := left(base, 12) || '_' || substr(gen_random_uuid()::text, 1, 6);
        exit;
      end if;
      uname := left(base, 20 - length(attempt::text) - 1) || '_' || attempt::text;
    end loop;
  end if;

  insert into public.profiles (id, username, first_name, last_name, newsletter_opt_in)
  values (
    new.id,
    uname,
    nullif(btrim(coalesce(meta ->> 'first_name', '')), ''),
    nullif(btrim(coalesce(meta ->> 'last_name', '')), ''),
    coalesce((meta ->> 'newsletter_opt_in')::boolean, false)
  );

  return new;
exception
  when unique_violation then
    raise exception 'username_taken';
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.username_available(p_username text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (
    select 1
    from public.profiles p
    where lower(p.username) = lower(btrim(p_username))
  );
$$;

revoke execute on function public.username_available(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;
