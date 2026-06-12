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

function ArtworkCaption({ artwork }: { artwork: Artwork }) {
  return (
    <div>
      <p className="font-serif text-lg md:text-xl text-teal italic">
        {artwork.title}
      </p>
      <BrushDivider width="w-12" className="my-2" />
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
    <div className={cn("w-full max-w-[min(100%,480px)] mx-auto lg:mx-0 lg:max-w-none", className)}>
      <div className="gallery-wall-scene">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center gap-5 sm:gap-6">
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
                    objectPosition={normalizeObjectPosition(artwork.object_position)}
                    sizes="(max-width: 640px) 200px, 255px"
                    watermark={false}
                  />
                </div>
              </div>
            </div>
            <div className="gallery-shelf" aria-hidden="true" />
          </div>

          <div className="hidden lg:block pb-6 shrink-0 min-w-[7rem]">
            <ArtworkCaption artwork={artwork} />
          </div>

          <div className="gallery-vase-decor hidden md:block" aria-hidden="true">
            <div className="gallery-vase" />
            <div className="gallery-branches" />
          </div>
        </div>
      </div>

      <div className="mt-4 text-center sm:text-left lg:hidden max-w-[280px] mx-auto sm:mx-0">
        <ArtworkCaption artwork={artwork} />
      </div>
    </div>
  );
}
