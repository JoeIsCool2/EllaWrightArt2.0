import type { Artwork } from "@/lib/artworks/types";
import { formatMediumLabel } from "@/lib/artworks/display";
import { cn } from "@/lib/utils";

interface ArtworkLabelProps {
  artwork: Artwork;
  align?: "left" | "right";
  className?: string;
}

export function ArtworkLabel({
  artwork,
  align = "left",
  className = "",
}: ArtworkLabelProps) {
  return (
    <div
      className={cn(
        align === "right" && "text-left lg:text-right",
        className
      )}
    >
      <p className="font-serif text-teal text-base md:text-lg italic">
        {artwork.title}
      </p>
      <p className="text-sm text-teal/60 mt-0.5">
        {artwork.size}
        <br />
        {formatMediumLabel(artwork.medium)}
      </p>
    </div>
  );
}
