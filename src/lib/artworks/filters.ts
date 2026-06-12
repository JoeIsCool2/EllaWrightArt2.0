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
  subtitle: string;
  description: string;
  href: string;
  image: string;
  alt: string;
  objectPosition: string;
}

const ABOUT_COLLAGE_SLUGS = [
  "heavenly-hands",
  "worshipping-the-living-water",
  "mary-and-jesus",
  "benefactor-of-pioneer-greatness",
] as const;

const ABOUT_COLLAGE_FALLBACK_SLUGS = [
  "heavenly-mother",
  "the-woman-at-the-well",
  "brother-of-jared",
  "the-service-quilt",
  "house-of-the-lord",
  "the-woman-with-the-issue-of-blood",
] as const;

/** Curated artworks for the About page 2×2 collage — spiritual, feminine, and motherhood themes only. */
export function getAboutCollageArtworks(artworks: Artwork[]): Artwork[] {
  const used = new Set<string>();
  const selected: Artwork[] = [];

  const add = (artwork: Artwork | undefined) => {
    if (artwork && !used.has(artwork.id)) {
      used.add(artwork.id);
      selected.push(artwork);
    }
  };

  for (const slug of ABOUT_COLLAGE_SLUGS) {
    add(artworks.find((a) => a.slug === slug));
  }

  for (const slug of ABOUT_COLLAGE_FALLBACK_SLUGS) {
    if (selected.length >= 4) break;
    add(artworks.find((a) => a.slug === slug));
  }

  if (selected.length < 4) {
    for (const category of ["spiritual", "women-motherhood"] as const) {
      if (selected.length >= 4) break;
      for (const artwork of artworks) {
        if (selected.length >= 4) break;
        if (artwork.category === category && !used.has(artwork.id)) {
          add(artwork);
        }
      }
    }
  }

  return selected.slice(0, 4);
}

export function getCategoryPreviewArtworks(
  artworks: Artwork[]
): CategoryPreview[] {
  const findBySlug = (slug: string) => artworks.find((a) => a.slug === slug);
  const findByCategory = (category: Artwork["category"]) =>
    artworks.find((a) => a.category === category);

  const spiritual =
    findBySlug("brother-of-jared") ??
    findBySlug("worshipping-the-living-water") ??
    findBySlug("house-of-the-lord") ??
    findByCategory("spiritual");

  const landscapes =
    findBySlug("making-waves") ??
    findBySlug("quail") ??
    findBySlug("coyote") ??
    findByCategory("landscapes");

  const motherhood =
    findBySlug("mary-and-jesus") ??
    findBySlug("benefactor-of-pioneer-greatness") ??
    findBySlug("the-service-quilt") ??
    findByCategory("women-motherhood");

  return [
    {
      title: "Spiritual Works",
      subtitle: "FAITH, STILLNESS & LIGHT",
      description:
        "Paintings that reflect faith, hope, and the divine within.",
      href: "/gallery?category=spiritual",
      image: spiritual?.image_url ?? "/artwork/brother-of-jared.jpg",
      alt: spiritual?.image_alt ?? "Spiritual Works category preview",
      objectPosition: normalizeObjectPosition(
        spiritual?.object_position ?? "center 32%"
      ),
    },
    {
      title: "Landscapes",
      subtitle: "ALPINE, UTAH & BEYOND",
      description: "Capturing the light, color, and peace of Alpine, Utah.",
      href: "/gallery?category=landscapes",
      image: landscapes?.image_url ?? "/artwork/making-waves.jpg",
      alt: landscapes?.image_alt ?? "Landscapes category preview",
      objectPosition: normalizeObjectPosition(
        landscapes?.object_position ?? "center center"
      ),
    },
    {
      title: "Women & Motherhood",
      subtitle: "STRENGTH, LOVE & GRACE",
      description:
        "Honoring the strength, softness, and beauty of womanhood.",
      href: "/gallery?category=women-motherhood",
      image: motherhood?.image_url ?? "/artwork/mary-and-jesus.jpg",
      alt: motherhood?.image_alt ?? "Women and Motherhood category preview",
      objectPosition: normalizeObjectPosition(
        motherhood?.object_position ?? "center 25%"
      ),
    },
  ];
}
