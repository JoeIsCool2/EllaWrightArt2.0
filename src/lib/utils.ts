export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatArtworkMeta(artwork: {
  size: string;
  year: number;
  medium: string;
}): string {
  const medium =
    artwork.medium.toLowerCase() === "oil on canvas"
      ? "Oil on Canvas"
      : artwork.medium.toLowerCase() === "oil on wood panel"
        ? "Oil on Wood Panel"
        : artwork.medium;
  return `${artwork.size} • ${artwork.year} • ${medium}`;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    spiritual: "Spiritual",
    landscapes: "Landscapes",
    "women-motherhood": "Women & Motherhood",
  };
  return labels[category] || category;
}
