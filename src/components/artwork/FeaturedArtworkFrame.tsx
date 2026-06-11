import type { Artwork } from "@/lib/artworks/types";
import { normalizeObjectPosition } from "@/lib/artworks/display";
import { cn } from "@/lib/utils";
import { ProtectedArtworkImage } from "./ProtectedArtworkImage";

interface FeaturedArtworkFrameProps {
  artwork: Artwork;
  priority?: boolean;
  sizes?: string;
  className?: string;
  maxWidthClass?: string;
  compact?: boolean;
}

/**
 * Featured artwork display — shows the full piece without awkward cropping.
 */
export function FeaturedArtworkFrame({
  artwork,
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 40vw",
  className = "",
  maxWidthClass = "max-w-[min(100%,380px)] lg:max-w-[440px]",
  compact = false,
}: FeaturedArtworkFrameProps) {
  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden shadow-[var(--shadow-card)] bg-ivory mx-auto lg:mx-0",
        maxWidthClass,
        className
      )}
    >
      <div
        className={cn(
          "relative w-full bg-ivory",
          compact
            ? "aspect-[4/5] max-h-[280px]"
            : "aspect-[4/5] max-h-[min(62vh,520px)] sm:max-h-[min(68vh,560px)]"
        )}
      >
        <ProtectedArtworkImage
          src={artwork.image_url}
          alt={artwork.image_alt}
          fill
          priority={priority}
          objectFit="contain"
          objectPosition={normalizeObjectPosition(artwork.object_position)}
          sizes={sizes}
          watermark={false}
        />
      </div>
    </div>
  );
}
