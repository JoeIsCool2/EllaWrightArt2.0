import type { Artwork } from "@/lib/artworks/types";
import { normalizeObjectPosition } from "@/lib/artworks/display";
import { ProtectedArtworkImage } from "@/components/artwork/ProtectedArtworkImage";
import { cn } from "@/lib/utils";

interface AboutArtCollageProps {
  artworks: Artwork[];
  className?: string;
}

export function AboutArtCollage({ artworks, className }: AboutArtCollageProps) {
  if (artworks.length === 0) return null;

  if (artworks.length < 4) {
    const artwork = artworks[0];
    return (
      <div className={cn("w-full max-w-md mx-auto lg:max-w-none", className)}>
        <FeaturedArtworkPanel artwork={artwork} priority />
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-md mx-auto lg:max-w-none", className)}>
      <p className="text-xs tracking-[0.18em] uppercase text-teal/50 font-medium mb-3 lg:mb-4">
        Selected Works
      </p>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {artworks.slice(0, 4).map((artwork, index) => (
          <CollageCell
            key={artwork.id}
            artwork={artwork}
            priority={index < 2}
          />
        ))}
      </div>
    </div>
  );
}

function CollageCell({
  artwork,
  priority,
}: {
  artwork: Artwork;
  priority?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white p-1.5 shadow-[var(--shadow-soft)] border border-teal/[0.06]">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-cream/30">
        <ProtectedArtworkImage
          src={artwork.image_url}
          alt={
            artwork.image_alt ||
            `${artwork.title} — original painting by Ella Wright`
          }
          fill
          priority={priority}
          objectFit="cover"
          objectPosition={normalizeObjectPosition(artwork.object_position)}
          sizes="(max-width: 1024px) 45vw, 260px"
          watermark={false}
        />
      </div>
    </div>
  );
}

function FeaturedArtworkPanel({
  artwork,
  priority,
}: {
  artwork: Artwork;
  priority?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white p-2 md:p-3 shadow-[var(--shadow-soft)] border border-teal/[0.06]">
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-cream/30">
        <ProtectedArtworkImage
          src={artwork.image_url}
          alt={
            artwork.image_alt ||
            `${artwork.title} — original painting by Ella Wright`
          }
          fill
          priority={priority}
          objectFit="cover"
          objectPosition={normalizeObjectPosition(artwork.object_position)}
          sizes="(max-width: 1024px) 100vw, 480px"
          watermark={false}
        />
      </div>
    </div>
  );
}
