export type ArtworkCategory = "spiritual" | "landscapes" | "women-motherhood";

export interface Artwork {
  id: string;
  title: string;
  slug: string;
  category: ArtworkCategory;
  medium: string;
  size: string;
  year: number;
  description: string;
  image_url: string;
  image_alt: string;
  object_position?: string;
  is_available: boolean;
  is_featured: boolean;
  show_on_home: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type ArtworkInput = Omit<Artwork, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

export interface ArtworkFormData {
  title: string;
  slug: string;
  category: ArtworkCategory;
  medium: string;
  size: string;
  year: number;
  description: string;
  image_url: string;
  image_alt: string;
  object_position: string;
  is_available: boolean;
  is_featured: boolean;
  show_on_home: boolean;
  display_order: number;
}
