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
  "making-waves",
  "mary-and-jesus",
] as const;

/** Curated artworks for the About page 2×2 collage — one spiritual, landscape, and motherhood highlight. */
export function getAboutCollageArtworks(artworks: Artwork[]): Artwork[] {
  const used = new Set<string>();
  const selected: Artwork[] = [];

  for (const slug of ABOUT_COLLAGE_SLUGS) {
    const artwork = artworks.find((a) => a.slug === slug);
    if (artwork && !used.has(artwork.id)) {
      used.add(artwork.id);
      selected.push(artwork);
    }
  }

  if (selected.length < 4) {
    const categories: Artwork["category"][] = [
      "spiritual",
      "landscapes",
      "women-motherhood",
    ];
    for (const category of categories) {
      if (selected.length >= 4) break;
      const extra = artworks.find(
        (a) => a.category === category && !used.has(a.id)
      );
      if (extra) {
        used.add(extra.id);
        selected.push(extra);
      }
    }
  }

  while (selected.length < 4) {
    const extra = artworks.find((a) => !used.has(a.id));
    if (!extra) break;
    used.add(extra.id);
    selected.push(extra);
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
