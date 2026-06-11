import { SAMPLE_ARTWORKS } from "./sample-data";
import type { Artwork, ArtworkCategory, ArtworkInput } from "./types";
import { createClient, createPublicClient, isSupabaseConfigured } from "../supabase/server";

export { filterArtworks, isValidGalleryCategory, getCategoryPreviewArtworks } from "./filters";

function mapRow(row: Record<string, unknown>): Artwork {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    category: row.category as ArtworkCategory,
    medium: String(row.medium),
    size: String(row.size),
    year: Number(row.year),
    description: String(row.description),
    image_url: String(row.image_url),
    image_alt: String(row.image_alt),
    object_position: row.object_position
      ? String(row.object_position)
      : undefined,
    is_available: Boolean(row.is_available),
    is_featured: Boolean(row.is_featured),
    show_on_home: Boolean(row.show_on_home),
    display_order: Number(row.display_order),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

interface ArtworkFetchResult {
  artworks: Artwork[];
  usingSampleData: boolean;
}

async function fetchArtworksInternal(): Promise<ArtworkFetchResult> {
  if (!isSupabaseConfigured()) {
    return { artworks: SAMPLE_ARTWORKS, usingSampleData: true };
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return { artworks: SAMPLE_ARTWORKS, usingSampleData: true };
  }

  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[artworks] Supabase fetch failed:", error.message);
    return { artworks: SAMPLE_ARTWORKS, usingSampleData: true };
  }

  return {
    artworks: (data ?? []).map(mapRow),
    usingSampleData: false,
  };
}

/** Public site artwork list. Uses sample data only when Supabase is not configured. */
export async function getAllArtworks(): Promise<Artwork[]> {
  const { artworks } = await fetchArtworksInternal();
  return artworks;
}

/** Whether the public site is showing bundled sample artwork (Supabase not connected). */
export async function isUsingSampleData(): Promise<boolean> {
  const { usingSampleData } = await fetchArtworksInternal();
  return usingSampleData;
}

/** Admin-only: reads directly from Supabase with no sample fallback. */
export async function getAdminArtworks(): Promise<Artwork[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  const artworks = await getAllArtworks();
  return artworks.find((a) => a.slug === slug) ?? null;
}

export async function getFeaturedArtwork(): Promise<Artwork> {
  const { artworks, usingSampleData } = await fetchArtworksInternal();
  const featured =
    artworks.find((a) => a.is_featured) ??
    artworks.find((a) => a.slug === "heavenly-hands") ??
    artworks[0];

  if (featured) return featured;

  if (!usingSampleData && artworks.length === 0) {
    return SAMPLE_ARTWORKS.find((a) => a.slug === "heavenly-hands") ?? SAMPLE_ARTWORKS[0];
  }

  return SAMPLE_ARTWORKS.find((a) => a.slug === "heavenly-hands") ?? SAMPLE_ARTWORKS[0];
}

export async function getRelatedArtworks(
  artwork: Artwork,
  limit = 3
): Promise<Artwork[]> {
  const artworks = await getAllArtworks();
  const others = artworks.filter((a) => a.id !== artwork.id);

  const sameCategory = others.filter((a) => a.category === artwork.category);
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const differentCategory = others.filter(
    (a) => a.category !== artwork.category
  );
  return [...sameCategory, ...differentCategory].slice(0, limit);
}

// Admin mutations (Supabase only)
export async function createArtwork(input: ArtworkInput): Promise<Artwork> {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured");

  const { data, error } = await supabase
    .from("artworks")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function updateArtwork(
  id: string,
  input: Partial<ArtworkInput>
): Promise<Artwork> {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured");

  const { data, error } = await supabase
    .from("artworks")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function deleteArtwork(id: string): Promise<void> {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured");

  const { error } = await supabase.from("artworks").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function reorderArtworks(
  items: { id: string; display_order: number }[]
): Promise<void> {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured");

  for (const item of items) {
    const { error } = await supabase
      .from("artworks")
      .update({ display_order: item.display_order })
      .eq("id", item.id);
    if (error) throw new Error(error.message);
  }
}
