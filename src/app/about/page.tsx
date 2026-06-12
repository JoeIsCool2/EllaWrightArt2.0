import type { Metadata } from "next";
import { getAllArtworks } from "@/lib/artworks/service";
import { getAboutCollageArtworks } from "@/lib/artworks/filters";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutBio } from "@/components/about/AboutBio";
import { AboutArtCollage } from "@/components/about/AboutArtCollage";
import { AboutQuote } from "@/components/about/AboutQuote";
import { AboutCTA } from "@/components/about/AboutCTA";
import { WatercolorAccents } from "@/components/home/WatercolorAccents";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Ella Wright, a studio art student at the University of Utah creating oil paintings inspired by femininity, spirituality, and motherhood.",
  openGraph: {
    title: "About | EllaWrightsArt",
    description:
      "Learn about Ella Wright, a studio art student at the University of Utah creating oil paintings inspired by femininity, spirituality, and motherhood.",
  },
};

export default async function AboutPage() {
  const artworks = await getAllArtworks();
  const collageArtworks = getAboutCollageArtworks(artworks);

  return (
    <section className="relative py-6 md:py-10 lg:py-12 overflow-x-hidden">
      <WatercolorAccents />
      <LayoutContainer className="relative">
        <div className="flex flex-col gap-8 md:gap-10 lg:grid lg:grid-cols-12 lg:gap-x-10 lg:gap-y-8 lg:items-start">
          <div className="order-1 lg:col-span-6 lg:col-start-1 flex flex-col">
            <AboutHero />
            <AboutBio />
            <AboutQuote className="hidden lg:block mt-8" />
          </div>

          <div className="order-2 lg:col-span-6 lg:col-start-7 lg:sticky lg:top-24">
            <AboutArtCollage artworks={collageArtworks} />
          </div>

          <AboutQuote className="order-3 lg:hidden" />

          <AboutCTA className="order-4 lg:col-span-12" />
        </div>
      </LayoutContainer>
    </section>
  );
}
