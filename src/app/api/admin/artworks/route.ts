import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/supabase/admin";
import { ensureUniqueSlug, friendlyDatabaseError } from "@/lib/artworks/admin-api";
import { sanitizeText, LIMITS } from "@/lib/validation";

function validateArtworkBody(body: Record<string, unknown>): string | null {
  const title = sanitizeText(body.title, LIMITS.name);
  const slug = sanitizeText(body.slug, 120);
  const imageUrl = sanitizeText(body.image_url, 2048);
  const size = sanitizeText(body.size, LIMITS.size);
  const medium = sanitizeText(body.medium, 100);

  if (!title) return "Title is required.";
  if (!slug) return "Slug is required.";
  if (!imageUrl) return "Please upload an artwork image before saving.";
  if (!size) return "Size is required.";
  if (!medium) return "Medium is required.";

  if (imageUrl.startsWith("blob:")) {
    return "Image must be uploaded to storage before saving.";
  }

  const validCategories = ["spiritual", "landscapes", "women-motherhood"];
  if (!validCategories.includes(String(body.category))) {
    return "Please choose a valid category.";
  }

  const year = Number(body.year);
  if (!year || year < 1900 || year > 2100) {
    return "Please enter a valid year.";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const { supabase } = await requireAuth();
    const body = await request.json();

    const validationError = validateArtworkBody(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const uniqueSlug = await ensureUniqueSlug(
      supabase,
      sanitizeText(body.slug, 120)
    );

    const { data, error } = await supabase
      .from("artworks")
      .insert({
        title: sanitizeText(body.title, LIMITS.name),
        slug: uniqueSlug,
        category: body.category,
        medium: sanitizeText(body.medium, 100) || "Oil on Canvas",
        size: sanitizeText(body.size, LIMITS.size),
        year: Number(body.year),
        description: sanitizeText(body.description, LIMITS.description),
        image_url: sanitizeText(body.image_url, 2048),
        image_alt:
          sanitizeText(body.image_alt, 200) || sanitizeText(body.title, LIMITS.name),
        object_position:
          sanitizeText(body.object_position, 80) || "center center",
        is_available: Boolean(body.is_available),
        is_featured: Boolean(body.is_featured),
        show_on_home: Boolean(body.show_on_home),
        display_order: Number(body.display_order) || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("[artworks] Create failed:", error.message);
      return NextResponse.json(
        { error: friendlyDatabaseError(error.message) },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : 500 }
    );
  }
}
