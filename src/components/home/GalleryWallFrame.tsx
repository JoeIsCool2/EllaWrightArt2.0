import type { Artwork } from "@/lib/artworks/types";
import { normalizeObjectPosition, formatMediumLabel } from "@/lib/artworks/display";
import { ProtectedArtworkImage } from "@/components/artwork/ProtectedArtworkImage";
import { BrushDivider } from "@/components/ui/BrushDivider";
import { cn } from "@/lib/utils";

interface GalleryWallFrameProps {
  artwork: Artwork;
  priority?: boolean;
  className?: string;
}

function ArtworkCaption({
  artwork,
  className,
}: {
  artwork: Artwork;
  className?: string;
}) {
  return (
    <div className={cn("text-center lg:text-left", className)}>
      <p className="font-serif text-lg md:text-xl text-teal italic">
        {artwork.title}
      </p>
      <BrushDivider width="w-12" className="my-2 mx-auto lg:mx-0" />
      <p className="text-sm text-teal/60 leading-relaxed">
        {artwork.size}
        <br />
        {formatMediumLabel(artwork.medium)}
      </p>
    </div>
  );
}

export function GalleryWallFrame({
  artwork,
  priority = false,
  className,
}: GalleryWallFrameProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[min(100%,420px)] mx-auto lg:mx-0 lg:max-w-none",
        className
      )}
    >
      <div className="gallery-wall-scene">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 lg:items-end">
          <div className="gallery-frame-wrapper shrink-0">
            <div className="gallery-frame">
              <div className="gallery-frame-inner">
                <div className="relative aspect-[4/5] w-[200px] sm:w-[220px] md:w-[240px] lg:w-[255px] bg-ivory">
                  <ProtectedArtworkImage
                    src={artwork.image_url}
                    alt={artwork.image_alt || artwork.title}
                    fill
                    priority={priority}
                    objectFit="contain"
                    objectPosition={normalizeObjectPosition(
                      artwork.object_position
                    )}
                    sizes="(max-width: 640px) 200px, 255px"
                    watermark={false}
                  />
                </div>
              </div>
            </div>
            <div className="gallery-shelf" aria-hidden="true" />
          </div>

          <ArtworkCaption
            artwork={artwork}
            className="hidden lg:block pb-5 shrink-0 min-w-[7.5rem]"
          />
        </div>
      </div>

      <ArtworkCaption
        artwork={artwork}
        className="mt-5 lg:hidden max-w-[280px] mx-auto sm:mx-0"
      />
    </div>
  );
}
