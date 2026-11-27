-- Public bucket for published student sites (compiled static HTML).
insert into storage.buckets (id, name, public)
values ('sites', 'sites', true)
on conflict (id) do nothing;

-- Anyone can read published sites; writes go through the service role key in /api/publish.
create policy sites_public_read
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'sites');
