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
      <div className={cn("w-full max-w-sm mx-auto lg:max-w-none", className)}>
        <div className="rounded-2xl bg-white p-3 md:p-4 shadow-[var(--shadow-soft)] border border-teal/[0.06]">
          <div className="relative h-[320px] sm:h-[360px] lg:h-[380px] rounded-xl overflow-hidden bg-cream/30">
            <ProtectedArtworkImage
              src={artwork.image_url}
              alt={getAlt(artwork)}
              fill
              priority
              objectFit="cover"
              objectPosition={normalizeObjectPosition(artwork.object_position)}
              sizes="(max-width: 1024px) 100vw, 420px"
              watermark={false}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-sm mx-auto lg:max-w-none", className)}>
      <div className="rounded-2xl bg-white p-3 md:p-4 shadow-[var(--shadow-soft)] border border-teal/[0.06]">
        <p className="text-xs tracking-[0.18em] uppercase text-teal/50 font-medium mb-3">
          Selected Works
        </p>
        <div className="grid grid-cols-2 grid-rows-2 gap-2.5 md:gap-3 h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px] overflow-hidden">
          {artworks.slice(0, 4).map((artwork, index) => (
            <CollageCell
              key={artwork.id}
              artwork={artwork}
              priority={index < 2}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function getAlt(artwork: Artwork): string {
  return (
    artwork.image_alt ||
    `${artwork.title} — original painting by Ella Wright`
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
    <div className="relative min-h-0 rounded-lg overflow-hidden bg-cream/30 border border-teal/[0.04]">
      <ProtectedArtworkImage
        src={artwork.image_url}
        alt={getAlt(artwork)}
        fill
        priority={priority}
        objectFit="cover"
        objectPosition={normalizeObjectPosition(artwork.object_position)}
        sizes="(max-width: 1024px) 42vw, 200px"
        watermark={false}
      />
    </div>
  );
}
