import type { Artwork } from "./types";
import { normalizeObjectPosition } from "./display";

export function filterArtworks(
  artworks: Artwork[],
  category: string
): Artwork[] {
  if (category === "all") return artworks;
  if (category === "available") return artworks.filter((a) => a.is_available);
  return artworks.filter((a) => a.category === category);
}

export function isValidGalleryCategory(category: string): boolean {
  return [
    "all",
    "spiritual",
    "landscapes",
    "women-motherhood",
    "available",
  ].includes(category);
}

export interface CategoryPreview {
  title: string;
  description: string;
  href: string;
  image: string;
  alt: string;
  objectPosition: string;
}

export function getCategoryPreviewArtworks(
  artworks: Artwork[]
): CategoryPreview[] {
  const findBySlug = (slug: string) => artworks.find((a) => a.slug === slug);
  const findByCategory = (category: Artwork["category"]) =>
    artworks.find((a) => a.category === category);

  const spiritual =
    findBySlug("worshipping-the-living-water") ??
    findBySlug("brother-of-jared") ??
    findByCategory("spiritual");

  const landscapes =
    findBySlug("perspective") ??
    findBySlug("wildflower-valley") ??
    findByCategory("landscapes");

  const motherhood =
    findBySlug("mary-and-jesus") ??
    findBySlug("heavenly-hands") ??
    findByCategory("women-motherhood");

  return [
    {
      title: "Spiritual Works",
      description:
        "Paintings that reflect faith, hope, and the divine within.",
      href: "/gallery?category=spiritual",
      image: spiritual?.image_url ?? "/artwork/grace-in-bloom.jpg",
      alt: spiritual?.image_alt ?? "Spiritual Works category preview",
      objectPosition: normalizeObjectPosition(spiritual?.object_position),
    },
    {
      title: "Landscapes",
      description: "Capturing the light, color, and peace of Alpine, Utah.",
      href: "/gallery?category=landscapes",
      image: landscapes?.image_url ?? "/artwork/wildflower-valley.jpg",
      alt: landscapes?.image_alt ?? "Landscapes category preview",
      objectPosition: normalizeObjectPosition(landscapes?.object_position),
    },
    {
      title: "Women & Motherhood",
      description:
        "Honoring the strength, softness, and beauty of womanhood.",
      href: "/gallery?category=women-motherhood",
      image: motherhood?.image_url ?? "/artwork/close-to-my-heart.jpg",
      alt: motherhood?.image_alt ?? "Women and Motherhood category preview",
      objectPosition: normalizeObjectPosition(motherhood?.object_position),
    },
  ];
}
