import type { Artwork } from "@/lib/artworks/types";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { Button } from "@/components/ui/Button";
import { BrushDivider } from "@/components/ui/BrushDivider";
import { GalleryWallFrame } from "./GalleryWallFrame";
import { WatercolorAccents } from "./WatercolorAccents";

interface HomeHeroProps {
  featured: Artwork;
}

export function HomeHero({ featured }: HomeHeroProps) {
  return (
    <section className="relative overflow-x-hidden py-8 md:py-12 lg:py-14">
      <WatercolorAccents />
      <LayoutContainer className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16 items-center">
          <div className="order-1 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-coral font-medium mb-3">
              Art inspired by faith, nature & femininity
            </p>
            <BrushDivider width="w-14" className="mb-5 mx-auto lg:mx-0" />
            <h1 className="font-serif text-4xl sm:text-[2.75rem] md:text-5xl lg:text-[3.25rem] text-teal leading-[1.12] mb-5">
              Stories of Spirit, Strength & Sacred Beauty
            </h1>
            <p className="text-base md:text-lg text-teal/75 leading-relaxed mb-7 max-w-md mx-auto lg:mx-0">
              Oil paintings inspired by femininity, spirituality, motherhood, and
              the landscapes of Alpine, Utah.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button href="/gallery" variant="primary" size="lg">
                View Gallery
              </Button>
              <Button href="/commissions" variant="secondary" size="lg">
                Request a Commission
              </Button>
            </div>
          </div>

          <div className="order-2 lg:justify-self-end w-full">
            <GalleryWallFrame artwork={featured} priority />
          </div>
        </div>
      </LayoutContainer>
    </section>
  );
}
