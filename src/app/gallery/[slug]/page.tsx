import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllArtworks,
  getArtworkBySlug,
  getRelatedArtworks,
} from "@/lib/artworks/service";
import { getArtworkDescription } from "@/lib/artworks/display";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { ArtworkDetail } from "@/components/artwork/ArtworkDetail";
import { RelatedArtwork } from "@/components/artwork/RelatedArtwork";

interface ArtworkPageProps {
  params: Promise<{ slug: string }>;
}

function absoluteImageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const artworks = await getAllArtworks();
  return artworks.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: ArtworkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);
  if (!artwork) return { title: "Artwork Not Found" };

  const descriptionText =
    getArtworkDescription(artwork) ||
    `${artwork.title} — original oil painting by Ella Wright.`;
  const description = descriptionText.replace(/\n+/g, " ").slice(0, 160);
  const imageUrl = absoluteImageUrl(artwork.image_url);

  return {
    title: artwork.title,
    description,
    openGraph: {
      title: `${artwork.title} | ${SITE_NAME}`,
      description,
      images: [{ url: imageUrl, alt: artwork.image_alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${artwork.title} | ${SITE_NAME}`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);
  if (!artwork) notFound();

  const related = await getRelatedArtworks(artwork);

  return (
    <section className="py-8 md:py-12">
      <LayoutContainer>
        <ArtworkDetail artwork={artwork} />
        <RelatedArtwork artworks={related} />
      </LayoutContainer>
    </section>
  );
}
