import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/supabase/admin";
import { sanitizeText, LIMITS } from "@/lib/validation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function validateArtworkBody(body: Record<string, unknown>): string | null {
  if (body.image_url) {
    const imageUrl = sanitizeText(body.image_url, 2048);
    if (imageUrl.startsWith("blob:")) {
      return "Image must be uploaded to storage before saving.";
    }
  }
  return null;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { supabase } = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const validationError = validateArtworkBody(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.title !== undefined) updates.title = sanitizeText(body.title, LIMITS.name);
    if (body.slug !== undefined) updates.slug = sanitizeText(body.slug, 120);
    if (body.category !== undefined) updates.category = body.category;
    if (body.medium !== undefined) updates.medium = sanitizeText(body.medium, 100);
    if (body.size !== undefined) updates.size = sanitizeText(body.size, LIMITS.size);
    if (body.year !== undefined) updates.year = Number(body.year);
    if (body.description !== undefined)
      updates.description = sanitizeText(body.description, LIMITS.description);
    if (body.image_url !== undefined)
      updates.image_url = sanitizeText(body.image_url, 2048);
    if (body.image_alt !== undefined)
      updates.image_alt = sanitizeText(body.image_alt, 200);
    if (body.object_position !== undefined)
      updates.object_position =
        sanitizeText(body.object_position, 80) || "center center";
    if (body.is_available !== undefined) updates.is_available = Boolean(body.is_available);
    if (body.is_featured !== undefined) updates.is_featured = Boolean(body.is_featured);
    if (body.show_on_home !== undefined) updates.show_on_home = Boolean(body.show_on_home);
    if (body.display_order !== undefined)
      updates.display_order = Number(body.display_order);

    const { data, error } = await supabase
      .from("artworks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
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

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { supabase } = await requireAuth();
    const { id } = await params;

    const { error } = await supabase.from("artworks").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : 500 }
    );
  }
}
