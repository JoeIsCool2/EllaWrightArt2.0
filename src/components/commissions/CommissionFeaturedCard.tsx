import type { Artwork } from "@/lib/artworks/types";
import { normalizeObjectPosition } from "@/lib/artworks/display";
import { ArtworkLabel } from "@/components/artwork/ArtworkLabel";
import { ProtectedArtworkImage } from "@/components/artwork/ProtectedArtworkImage";

interface CommissionFeaturedCardProps {
  artwork: Artwork;
}

export function CommissionFeaturedCard({ artwork }: CommissionFeaturedCardProps) {
  return (
    <div className="bg-ivory rounded-xl border border-teal/[0.06] shadow-[var(--shadow-soft)] overflow-hidden">
      <div className="relative aspect-[4/3] bg-cream/30">
        <ProtectedArtworkImage
          src={artwork.image_url}
          alt={artwork.image_alt || artwork.title}
          fill
          sizes="(max-width: 1024px) 100vw, 320px"
          objectFit="contain"
          objectPosition={normalizeObjectPosition(artwork.object_position)}
          watermark={false}
        />
      </div>
      <div className="px-4 py-3.5 border-t border-teal/5">
        <ArtworkLabel artwork={artwork} />
      </div>
    </div>
  );
}
