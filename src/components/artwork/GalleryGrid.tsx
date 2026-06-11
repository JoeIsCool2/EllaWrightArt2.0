import type { Artwork } from "@/lib/artworks/types";
import { ArtworkCard } from "./ArtworkCard";
import { Button } from "@/components/ui/Button";

interface GalleryGridProps {
  artworks: Artwork[];
  category?: string;
}

export function GalleryGrid({ artworks, category = "all" }: GalleryGridProps) {
  if (artworks.length === 0) {
    const isAvailableFilter = category === "available";

    return (
      <div className="text-center py-20 px-4">
        <p className="font-serif text-2xl text-teal mb-3">
          {isAvailableFilter
            ? "No available works right now"
            : "No artwork in this category"}
        </p>
        <p className="text-teal/60 text-lg mb-8 max-w-md mx-auto">
          {isAvailableFilter
            ? "Check back soon, or reach out about a custom commission."
            : "Try another category, or browse the full gallery."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/gallery" variant="primary">
            View All Artwork
          </Button>
          <Button href="/commissions" variant="secondary">
            Request a Commission
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
}
