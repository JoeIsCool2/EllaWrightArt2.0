import type { Metadata } from "next";
import {
  getFeaturedArtwork,
  getAllArtworks,
  getCategoryPreviewArtworks,
} from "@/lib/artworks/service";
import { SITE_DESCRIPTION } from "@/lib/constants";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { Button } from "@/components/ui/Button";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeCollections } from "@/components/home/HomeCollections";

export const metadata: Metadata = {
  title: "EllaWrightsArt",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "EllaWrightsArt",
    description: SITE_DESCRIPTION,
    images: [{ url: "/artwork/heavenly-hands.jpg" }],
  },
};

export const revalidate = 60;

export default async function HomePage() {
  const [featured, allArtworks] = await Promise.all([
    getFeaturedArtwork(),
    getAllArtworks(),
  ]);
  const categoryCards = getCategoryPreviewArtworks(allArtworks);

  return (
    <>
      <HomeHero featured={featured} />
      <HomeCollections cards={categoryCards} />

      <section className="relative py-12 md:py-16 overflow-hidden border-t border-teal/5">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(91,154,160,0.2) 0%, transparent 55%), radial-gradient(ellipse at 80% 60%, rgba(230,138,110,0.15) 0%, transparent 50%)",
          }}
          aria-hidden="true"
        />
        <LayoutContainer className="relative text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-teal mb-3">
            Commissions are currently open.
          </h2>
          <p className="text-base md:text-lg text-teal/70 mb-6 max-w-md mx-auto">
            Let&apos;s create something meaningful together—made just for you.
          </p>
          <Button href="/commissions" variant="coral" size="lg">
            Request a Commission
          </Button>
        </LayoutContainer>
      </section>
    </>
  );
}
