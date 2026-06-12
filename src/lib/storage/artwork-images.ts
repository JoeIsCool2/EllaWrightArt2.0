import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const ARTWORK_IMAGES_BUCKET = "artwork-images";

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function getAllowedImageExtensions(): string[] {
  return ["jpg", "jpeg", "png", "webp"];
}

export function isAllowedImageType(mimeType: string): boolean {
  return mimeType in MIME_TO_EXT;
}

export function extensionFromMime(mimeType: string): string | null {
  return MIME_TO_EXT[mimeType] ?? null;
}

export function sanitizeSlugForPath(slug: string): string {
  const cleaned = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return cleaned || "artwork";
}

export function buildArtworkStoragePath(slug: string, extension: string): string {
  const safeSlug = sanitizeSlugForPath(slug);
  const ext = ALLOWED_EXTENSIONS.has(extension.toLowerCase())
    ? extension.toLowerCase()
    : "jpg";
  const timestamp = Date.now();
  return `artworks/${safeSlug}/${safeSlug}-${timestamp}.${ext}`;
}

/** Extract storage object path from a Supabase public URL, if it belongs to our bucket. */
export function parseArtworkStoragePath(imageUrl: string): string | null {
  if (!imageUrl || imageUrl.startsWith("/") || imageUrl.startsWith("blob:")) {
    return null;
  }

  try {
    const url = new URL(imageUrl);
    const marker = `/storage/v1/object/public/${ARTWORK_IMAGES_BUCKET}/`;
    const index = url.pathname.indexOf(marker);
    if (index === -1) return null;
    return decodeURIComponent(url.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}

export function getPublicArtworkImageUrl(storagePath: string): string {
  const env = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!env) return "";
  const base = env.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${ARTWORK_IMAGES_BUCKET}/${storagePath}`;
}

export async function deleteArtworkStorageFile(
  imageUrl: string | null | undefined
): Promise<void> {
  const path = imageUrl ? parseArtworkStoragePath(imageUrl) : null;
  if (!path) return;

  const supabase = createServiceRoleClient();
  if (!supabase) return;

  const { error } = await supabase.storage
    .from(ARTWORK_IMAGES_BUCKET)
    .remove([path]);

  if (error) {
    console.error("[storage] Failed to delete artwork image:", error.message);
  }
}

export function friendlyStorageError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("bucket") && lower.includes("not found")) {
    return 'Storage bucket "artwork-images" was not found. Create it in Supabase Storage (public) and run migration 004_storage_bucket.sql.';
  }

  if (lower.includes("row-level security") || lower.includes("policy")) {
    return "Upload was blocked by storage permissions. Add SUPABASE_SERVICE_ROLE_KEY on the server and run migration 004_storage_bucket.sql.";
  }

  if (lower.includes("payload too large") || lower.includes("entity too large")) {
    return "Image file is too large for storage. Try a smaller file.";
  }

  return message;
}
