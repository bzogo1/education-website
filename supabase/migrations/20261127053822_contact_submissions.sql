create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

create index contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;

-- Public insert-only access: anyone may submit, nobody can read via the Data API.
create policy contact_submissions_insert_public
  on public.contact_submissions
  for insert
  to anon, authenticated
  with check (true);
