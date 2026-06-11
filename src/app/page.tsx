import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Heart } from "lucide-react";
import {
  getFeaturedArtwork,
  getAllArtworks,
  getCategoryPreviewArtworks,
} from "@/lib/artworks/service";
import { SITE_DESCRIPTION } from "@/lib/constants";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { Button } from "@/components/ui/Button";
import { ArtworkLabel } from "@/components/artwork/ArtworkLabel";
import { FeaturedArtworkFrame } from "@/components/artwork/FeaturedArtworkFrame";
import { ProtectedArtworkImage } from "@/components/artwork/ProtectedArtworkImage";

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
      <section className="py-6 md:py-12 lg:py-14 overflow-x-hidden">
        <LayoutContainer>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 lg:gap-16 items-center">
            <div className="animate-fade-in text-center lg:text-left">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] text-teal leading-[1.1] mb-4">
                EllaWrightsArt
              </h1>
              <p className="text-base md:text-lg text-teal/80 leading-relaxed mb-6 max-w-md mx-auto lg:mx-0">
                Oil paintings inspired by femininity, spirituality, motherhood,
                and the landscapes of Alpine, Utah.
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

            <div className="animate-fade-in-delay w-full max-w-[340px] sm:max-w-[380px] mx-auto lg:max-w-[440px] lg:mx-0 lg:justify-self-end">
              <FeaturedArtworkFrame
                artwork={featured}
                priority
                sizes="(max-width: 1024px) 85vw, 440px"
              />
              <ArtworkLabel
                artwork={featured}
                align="right"
                className="mt-3 lg:mt-4"
              />
            </div>
          </div>
        </LayoutContainer>
      </section>

      <section className="py-8 md:py-12">
        <LayoutContainer size="narrow">
          <p className="text-center text-base md:text-lg text-teal/80 leading-relaxed">
            Ella creates colorful oil paintings that explore the sacred in the
            everyday—celebrating spirituality, femininity, motherhood, and the
            beauty of the natural world. Her work is inspired by faith, family,
            and the landscapes she calls home in Alpine, Utah.
          </p>
        </LayoutContainer>
      </section>

      <section className="py-8 md:py-14 overflow-x-hidden">
        <LayoutContainer>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {categoryCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-ivory">
                  <ProtectedArtworkImage
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    objectPosition={card.objectPosition}
                    objectFit="cover"
                    imageClassName="group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-5 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-serif text-lg md:text-xl text-teal group-hover:text-coral transition-colors">
                      {card.title}
                    </h2>
                    <p className="text-sm text-teal/60 mt-1.5 leading-relaxed line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-coral shrink-0 mb-0.5"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>
        </LayoutContainer>
      </section>

      <section className="relative py-12 md:py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(135deg, rgba(91,154,160,0.3) 0%, rgba(230,138,110,0.2) 40%, rgba(212,168,83,0.2) 70%, rgba(45,106,79,0.2) 100%)",
          }}
          aria-hidden="true"
        />
        <LayoutContainer className="relative text-center">
          <Heart
            size={22}
            className="mx-auto text-gold mb-4"
            aria-hidden="true"
          />
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
