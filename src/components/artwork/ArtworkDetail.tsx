import Link from "next/link";
import type { Artwork } from "@/lib/artworks/types";
import { getCategoryLabel } from "@/lib/utils";
import {
  getArtworkDescription,
  formatMediumLabel,
} from "@/lib/artworks/display";
import { Button } from "@/components/ui/Button";
import { BrushDivider } from "@/components/ui/BrushDivider";
import { ProtectedArtworkImage } from "./ProtectedArtworkImage";

interface ArtworkDetailProps {
  artwork: Artwork;
}

export function ArtworkDetail({ artwork }: ArtworkDetailProps) {
  const description = getArtworkDescription(artwork);
  const paragraphs = description?.split("\n\n").filter(Boolean) ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
      <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-card)] bg-ivory">
        <ProtectedArtworkImage
          src={artwork.image_url}
          alt={artwork.image_alt}
          width={1200}
          height={1600}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          watermark={false}
          className="w-full"
          imageClassName="w-full h-auto block"
        />
      </div>

      <div className="lg:pt-2">
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-teal mb-3">
          {artwork.title}
        </h1>
        <BrushDivider className="mb-6" width="w-16" />

        <dl className="mb-8 divide-y divide-coral/25 border-t border-b border-coral/25">
          {[
            { label: "MEDIUM", value: formatMediumLabel(artwork.medium) },
            { label: "SIZE", value: artwork.size },
            { label: "DATE", value: String(artwork.year) },
            { label: "CATEGORY", value: getCategoryLabel(artwork.category) },
          ].map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-[7rem_1fr] sm:grid-cols-[8rem_1fr] gap-4 py-3.5 items-baseline"
            >
              <dt className="text-xs font-medium tracking-wider text-teal/55 uppercase">
                {item.label}
              </dt>
              <dd className="text-teal font-medium">{item.value}</dd>
            </div>
          ))}
        </dl>

        {paragraphs.length > 0 && (
          <div className="space-y-4 mb-8 text-teal/80 leading-relaxed">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            href={`/contact?subject=${encodeURIComponent(`Inquiry about ${artwork.title}`)}`}
            variant="primary"
            size="lg"
            className="flex-1 text-center"
          >
            Inquire About This Piece
          </Button>
          <Button
            href="/commissions"
            variant="secondary"
            size="lg"
            className="flex-1 text-center"
          >
            Request a Commission
          </Button>
        </div>

        {artwork.is_available && (
          <p className="mt-5 text-sm text-teal/60">
            This piece is currently available for purchase.{" "}
            <Link href="/contact" className="text-coral hover:underline">
              Contact Ella
            </Link>{" "}
            to inquire.
          </p>
        )}
      </div>
    </div>
  );
}
