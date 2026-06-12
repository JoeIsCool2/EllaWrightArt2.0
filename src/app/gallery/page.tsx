import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllArtworks } from "@/lib/artworks/service";
import { SITE_DESCRIPTION } from "@/lib/constants";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { GalleryPageContent } from "@/components/artwork/GalleryPageContent";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Original oil paintings inspired by femininity, spirituality, and the landscapes of Alpine, Utah.",
  openGraph: {
    title: "Gallery | EllaWrightArt",
    description: SITE_DESCRIPTION,
  },
};

export const revalidate = 60;

function GalleryFallback() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-24 bg-teal/5 rounded-xl" />
      <div className="h-12 bg-teal/5 rounded-full w-full max-w-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] bg-teal/5 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default async function GalleryPage() {
  const artworks = await getAllArtworks();

  return (
    <section className="py-8 md:py-12">
      <LayoutContainer>
        <Suspense fallback={<GalleryFallback />}>
          <GalleryPageContent artworks={artworks} />
        </Suspense>
      </LayoutContainer>
    </section>
  );
}
