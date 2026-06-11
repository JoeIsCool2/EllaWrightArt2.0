-- Add optional focal point for gallery card cropping
alter table public.artworks
  add column if not exists object_position text not null default 'center center';
