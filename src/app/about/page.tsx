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
    title: "About | EllaWrightArt",
    description:
      "Learn about Ella Wright, a studio art student at the University of Utah creating oil paintings inspired by femininity, spirituality, and motherhood.",
  },
};

export default async function AboutPage() {
  const artworks = await getAllArtworks();
  const collageArtworks = getAboutCollageArtworks(artworks);

  return (
    <>
      <section
        className="relative py-6 md:py-10 lg:py-12 overflow-x-hidden"
        aria-labelledby="about-heading"
      >
        <WatercolorAccents />
        <LayoutContainer className="relative">
          <div className="flex flex-col gap-6 md:gap-7 lg:grid lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0 lg:items-start">
            <AboutHero className="order-1 lg:col-span-6 lg:col-start-1 lg:row-start-1" />
            <AboutBio className="order-2 lg:col-span-6 lg:col-start-1 lg:row-start-2" />
            <AboutQuote className="order-3 lg:col-span-6 lg:col-start-1 lg:row-start-3" />
            <AboutArtCollage
              artworks={collageArtworks}
              className="order-4 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:row-span-3 lg:self-start"
            />
          </div>
        </LayoutContainer>
      </section>

      <section
        className="py-12 md:py-16 lg:py-20 border-t border-teal/[0.08] bg-cream/25"
        aria-labelledby="about-cta-heading"
      >
        <LayoutContainer>
          <AboutCTA />
        </LayoutContainer>
      </section>
    </>
  );
}
