"use client";

import { useMemo, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Artwork } from "@/lib/artworks/types";
import { filterArtworks, isValidGalleryCategory } from "@/lib/artworks/filters";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GalleryFilters } from "./GalleryFilters";
import { GalleryGrid } from "./GalleryGrid";

const CATEGORY_HEADERS: Record<string, { title: string; subtitle: string }> = {
  spiritual: {
    title: "Spiritual Works",
    subtitle:
      "Paintings that reflect faith, hope, and the divine in everyday life—through sacred symbolism, prayerful moments, and the beauty within.",
  },
  landscapes: {
    title: "Landscapes",
    subtitle:
      "Capturing the light, color, and peace of Alpine, Utah—mountain valleys, wildflower meadows, and the quiet beauty of home.",
  },
  "women-motherhood": {
    title: "Women & Motherhood",
    subtitle:
      "Honoring the strength, softness, and sacred beauty of womanhood—celebrating mothers, daughters, and the bonds that shape us.",
  },
  available: {
    title: "Available Works",
    subtitle:
      "Original oil paintings currently available for purchase. Contact Ella to inquire about acquiring a piece.",
  },
};

interface GalleryPageContentProps {
  artworks: Artwork[];
}

function resolveCategory(raw: string | null): string {
  if (!raw || !isValidGalleryCategory(raw)) return "all";
  return raw;
}

export function GalleryPageContent({ artworks }: GalleryPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const category = resolveCategory(searchParams.get("category"));

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (categoryId === "all") {
        params.delete("category");
      } else {
        params.set("category", categoryId);
      }
      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `/gallery?${query}` : "/gallery", {
          scroll: false,
        });
      });
    },
    [router, searchParams]
  );

  const filtered = useMemo(
    () => filterArtworks(artworks, category),
    [artworks, category]
  );

  const header = CATEGORY_HEADERS[category] || {
    title: "Gallery",
    subtitle:
      "Original oil paintings inspired by femininity, spirituality, and the landscapes of Alpine, Utah.",
  };

  return (
    <>
      <SectionHeader title={header.title} subtitle={header.subtitle} />
      <GalleryFilters
        active={category}
        onChange={handleCategoryChange}
        disabled={isPending}
      />
      <GalleryGrid artworks={filtered} category={category} />
    </>
  );
}
