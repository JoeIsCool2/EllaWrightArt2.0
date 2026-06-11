import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Artwork } from "@/lib/artworks/types";
import { formatArtworkMeta } from "@/lib/utils";
import { normalizeObjectPosition } from "@/lib/artworks/display";
import { ProtectedArtworkImage } from "./ProtectedArtworkImage";

interface ArtworkCardProps {
  artwork: Artwork;
  showArrow?: boolean;
}

export function ArtworkCard({ artwork, showArrow = false }: ArtworkCardProps) {
  return (
    <Link
      href={`/gallery/${artwork.slug}`}
      className="group block h-full bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
        <ProtectedArtworkImage
          src={artwork.image_url}
          alt={artwork.image_alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          objectPosition={normalizeObjectPosition(artwork.object_position)}
          imageClassName="group-hover:scale-[1.02]"
        />
        {artwork.is_available && (
          <span className="absolute top-3 right-3 bg-teal text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
            Available
          </span>
        )}
      </div>
      <div className="p-4 md:p-5 flex items-start justify-between gap-2 min-h-[6.5rem]">
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-base md:text-lg text-teal group-hover:text-coral transition-colors line-clamp-3 leading-snug">
            {artwork.title}
          </h3>
          <p className="text-xs md:text-sm text-teal/60 mt-2 line-clamp-2 leading-relaxed">
            {formatArtworkMeta(artwork)}
          </p>
        </div>
        {showArrow && (
          <ArrowRight
            size={18}
            className="text-coral mt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-hidden="true"
          />
        )}
      </div>
    </Link>
  );
}
