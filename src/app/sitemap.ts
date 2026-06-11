import type { MetadataRoute } from "next";
import { getAllArtworks } from "@/lib/artworks/service";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const artworks = await getAllArtworks();
  const base = SITE_URL.replace(/\/$/, "");

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/gallery`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/commissions`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const artworkPages: MetadataRoute.Sitemap = artworks.map((artwork) => ({
    url: `${base}/gallery/${artwork.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...artworkPages];
}
