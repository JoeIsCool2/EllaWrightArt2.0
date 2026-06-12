-- EllaWrightsArt: Storage bucket + policies for artwork-images
-- Run in Supabase SQL Editor after 001_artworks.sql

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'artwork-images',
  'artwork-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Drop existing policies if re-running
drop policy if exists "Public read artwork images" on storage.objects;
drop policy if exists "Authenticated upload artwork images" on storage.objects;
drop policy if exists "Authenticated update artwork images" on storage.objects;
drop policy if exists "Authenticated delete artwork images" on storage.objects;

-- Public read for gallery images
create policy "Public read artwork images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'artwork-images');

-- Authenticated users can upload (backup if using client-side upload)
create policy "Authenticated upload artwork images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'artwork-images');

create policy "Authenticated update artwork images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'artwork-images')
  with check (bucket_id = 'artwork-images');

create policy "Authenticated delete artwork images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'artwork-images');
