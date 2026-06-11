import type { Artwork } from "./types";

export const DEFAULT_OBJECT_POSITION = "center center";

const GENERIC_DESCRIPTION_PATTERN =
  /^.+\s—\s(an original painting by Ella Wright\.?|a work by Ella Wright.*)$/i;

export function normalizeObjectPosition(position?: string): string {
  return position?.trim() || DEFAULT_OBJECT_POSITION;
}

export function isGenericDescription(description: string, title: string): boolean {
  const trimmed = description.trim();
  if (!trimmed) return true;
  if (GENERIC_DESCRIPTION_PATTERN.test(trimmed)) return true;
  if (trimmed === `${title} — an original painting by Ella Wright.`) return true;
  if (trimmed === `${title} — an original painting by Ella Wright`) return true;
  return false;
}

export function getArtworkDescription(artwork: Artwork): string | null {
  const paragraphs = artwork.description
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return null;
  if (paragraphs.every((p) => isGenericDescription(p, artwork.title))) return null;

  const meaningful = paragraphs.filter(
    (p) => !isGenericDescription(p, artwork.title)
  );

  return meaningful.length > 0 ? meaningful.join("\n\n") : null;
}

export function formatMediumLabel(medium: string): string {
  if (!medium) return "Oil on Canvas";
  if (medium.toLowerCase() === "oil on canvas") return "Oil on Canvas";
  if (medium.toLowerCase() === "oil on wood panel") return "Oil on Wood Panel";
  return medium;
}
