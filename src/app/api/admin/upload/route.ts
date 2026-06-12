import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/supabase/admin";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";
import {
  ARTWORK_IMAGES_BUCKET,
  buildArtworkStoragePath,
  extensionFromMime,
  friendlyStorageError,
  getPublicArtworkImageUrl,
  isAllowedImageType,
} from "@/lib/storage/artwork-images";
import { MAX_ARTWORK_FILE_BYTES, sanitizeText } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const { supabase: authSupabase } = await requireAuth();

    // Prefer service role when set; otherwise use the logged-in admin session
    const supabase = isServiceRoleConfigured()
      ? createServiceRoleClient() ?? authSupabase
      : authSupabase;

    const formData = await request.formData();
    const file = formData.get("file");
    const slugInput = formData.get("slug");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Please choose an image file to upload." }, { status: 400 });
    }

    if (!isAllowedImageType(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload JPG, JPEG, PNG, or WebP." },
        { status: 400 }
      );
    }

    if (file.size > MAX_ARTWORK_FILE_BYTES) {
      const maxMb = Math.round(MAX_ARTWORK_FILE_BYTES / (1024 * 1024));
      return NextResponse.json(
        { error: `Image must be ${maxMb} MB or smaller.` },
        { status: 400 }
      );
    }

    const slug = sanitizeText(slugInput, 120) || "artwork";
    const extension = extensionFromMime(file.type) ?? "jpg";
    const storagePath = buildArtworkStoragePath(slug, extension);
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(ARTWORK_IMAGES_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("[upload] Storage error:", uploadError.message);
      const hint = isServiceRoleConfigured()
        ? friendlyStorageError(uploadError.message)
        : `${friendlyStorageError(uploadError.message)} If this persists, add SUPABASE_SERVICE_ROLE_KEY in Vercel and run migration 004_storage_bucket.sql.`;
      return NextResponse.json({ error: hint }, { status: 400 });
    }

    const publicUrl = getPublicArtworkImageUrl(storagePath);

    return NextResponse.json({
      url: publicUrl,
      path: storagePath,
      fileName: file.name,
      size: file.size,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[upload]", message);
    return NextResponse.json(
      { error: message === "Unauthorized" ? "Please sign in to upload images." : message },
      { status: message === "Unauthorized" ? 401 : 500 }
    );
  }
}
