import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Artwork } from "@/lib/artworks/types";
import { formatMediumLabel, normalizeObjectPosition } from "@/lib/artworks/display";
import { BrushDividerCentered } from "@/components/ui/BrushDivider";
import { ProtectedArtworkImage } from "./ProtectedArtworkImage";

interface RelatedArtworkProps {
  artworks: Artwork[];
}

export function RelatedArtwork({ artworks }: RelatedArtworkProps) {
  if (artworks.length === 0) return null;

  return (
    <section className="mt-12 md:mt-16 pt-8 border-t border-teal/10">
      <h2 className="font-serif text-2xl md:text-3xl text-teal text-center mb-3">
        You May Also Love
      </h2>
      <BrushDividerCentered className="mb-8 md:mb-10" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {artworks.map((artwork) => (
          <Link
            key={artwork.id}
            href={`/gallery/${artwork.slug}`}
            className="group block bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-cream/40">
              <ProtectedArtworkImage
                src={artwork.image_url}
                alt={artwork.image_alt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                objectPosition={normalizeObjectPosition(artwork.object_position)}
                imageClassName="group-hover:scale-[1.02]"
              />
            </div>
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-serif text-lg text-teal group-hover:text-coral transition-colors line-clamp-1">
                  {artwork.title}
                </h3>
                <p className="text-sm text-teal/60 mt-0.5 line-clamp-1">
                  {formatMediumLabel(artwork.medium)} • {artwork.size}
                </p>
              </div>
              <ArrowRight
                size={18}
                className="text-coral shrink-0"
                aria-hidden="true"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
