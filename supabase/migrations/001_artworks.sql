-- EllaWrightArt: Artworks table migration
-- Run this in your Supabase SQL Editor

create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null check (category in ('spiritual', 'landscapes', 'women-motherhood')),
  medium text not null default 'Oil on Canvas',
  size text not null,
  year integer not null,
  description text not null default '',
  image_url text not null,
  image_alt text not null default '',
  object_position text not null default 'center center',
  is_available boolean not null default false,
  is_featured boolean not null default false,
  show_on_home boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for common queries
create index if not exists artworks_slug_idx on public.artworks (slug);
create index if not exists artworks_category_idx on public.artworks (category);
create index if not exists artworks_display_order_idx on public.artworks (display_order);

-- Enable Row Level Security
alter table public.artworks enable row level security;

-- Public read access for all artworks
create policy "Artworks are publicly readable"
  on public.artworks
  for select
  to anon, authenticated
  using (true);

-- Authenticated users can insert, update, delete
create policy "Authenticated users can insert artworks"
  on public.artworks
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update artworks"
  on public.artworks
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete artworks"
  on public.artworks
  for delete
  to authenticated
  using (true);

-- Storage bucket setup (run separately in Storage settings or via SQL):
-- 1. Create a bucket named "artwork-images" with public access enabled
-- 2. Add the following storage policies:

-- create policy "Public read access for artwork images"
--   on storage.objects for select
--   to anon, authenticated
--   using (bucket_id = 'artwork-images');

-- create policy "Authenticated users can upload artwork images"
--   on storage.objects for insert
--   to authenticated
--   with check (bucket_id = 'artwork-images');

-- create policy "Authenticated users can update artwork images"
--   on storage.objects for update
--   to authenticated
--   using (bucket_id = 'artwork-images');

-- create policy "Authenticated users can delete artwork images"
--   on storage.objects for delete
--   to authenticated
--   using (bucket_id = 'artwork-images');
