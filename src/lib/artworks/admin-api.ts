import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { slugify } from "@/lib/utils";

export async function ensureUniqueSlug(
  supabase: SupabaseClient,
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  const candidate = slugify(baseSlug) || "artwork";
  let suffix = 0;

  while (suffix < 100) {
    const slug = suffix === 0 ? candidate : `${candidate}-${suffix + 1}`;

    let query = supabase.from("artworks").select("id").eq("slug", slug);
    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query.maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return slug;

    suffix += 1;
  }

  return `${candidate}-${Date.now()}`;
}

export function friendlyDatabaseError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("duplicate") && lower.includes("slug")) {
    return "An artwork with this slug already exists. Try a different title or slug.";
  }

  if (lower.includes("violates check constraint") && lower.includes("category")) {
    return "Please choose a valid category.";
  }

  return message;
}
