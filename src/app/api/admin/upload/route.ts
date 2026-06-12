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
    await requireAuth();

    if (!isServiceRoleConfigured()) {
      return NextResponse.json(
        {
          error:
            "Image upload requires SUPABASE_SERVICE_ROLE_KEY on the server. Add it in Vercel Environment Variables and redeploy.",
        },
        { status: 503 }
      );
    }

    const supabase = createServiceRoleClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Server storage client is not configured." },
        { status: 503 }
      );
    }

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
      return NextResponse.json(
        { error: friendlyStorageError(uploadError.message) },
        { status: 400 }
      );
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
