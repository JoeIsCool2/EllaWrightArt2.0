import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CategoryPreview } from "@/lib/artworks/filters";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { ProtectedArtworkImage } from "@/components/artwork/ProtectedArtworkImage";
import { BrushDivider } from "@/components/ui/BrushDivider";

interface HomeCollectionsProps {
  cards: CategoryPreview[];
}

export function HomeCollections({ cards }: HomeCollectionsProps) {
  return (
    <section className="relative py-10 md:py-16 lg:py-20 overflow-x-hidden">
      <LayoutContainer>
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xs sm:text-sm tracking-[0.22em] uppercase text-teal font-medium">
            Explore the Collections
          </h2>
          <BrushDivider width="w-16" className="mt-4 mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group flex flex-col bg-ivory rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] border border-teal/[0.06] hover:shadow-[var(--shadow-card)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-cream/40">
                <ProtectedArtworkImage
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  objectPosition={card.objectPosition}
                  objectFit="cover"
                  imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                  watermark={false}
                />
              </div>
              <div className="flex items-start justify-between gap-3 p-5 md:p-6">
                <div className="min-w-0">
                  <h3 className="font-serif text-xl md:text-2xl text-teal group-hover:text-teal-light transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] tracking-[0.14em] uppercase text-teal/45 mt-2 font-medium">
                    {card.subtitle}
                  </p>
                </div>
                <ChevronRight
                  size={20}
                  className="text-coral shrink-0 mt-1 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </div>
            </Link>
          ))}
        </div>
      </LayoutContainer>
    </section>
  );
}
