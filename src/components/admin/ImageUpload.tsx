"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { MAX_ARTWORK_FILE_BYTES } from "@/lib/validation";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
}

export function ImageUpload({ value, onChange, onAltChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const supabaseReady = isSupabaseConfigured();

  async function handleUpload(file: File) {
    setUploading(true);
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, or WebP).");
      setUploading(false);
      return;
    }

    if (file.size > MAX_ARTWORK_FILE_BYTES) {
      setError("Image must be 15 MB or smaller.");
      setUploading(false);
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setError(
        "Image upload requires Supabase. Please configure your environment variables."
      );
      setUploading(false);
      return;
    }

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `artworks/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("artwork-images")
      .upload(fileName, file, { upsert: false, contentType: file.type });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("artwork-images")
      .getPublicUrl(fileName);

    onChange(data.publicUrl);
    onAltChange?.(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    setUploading(false);
  }

  return (
    <div className="space-y-3">
      {!supabaseReady && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          Supabase is not connected. Image upload will be available once
          environment variables are configured.
        </p>
      )}

      {value ? (
        <div className="relative w-full max-w-xs aspect-[4/5] rounded-xl overflow-hidden border border-teal/10">
          <Image src={value} alt="Artwork preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 text-teal hover:text-coral"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-teal/20 rounded-xl p-8 text-center cursor-pointer hover:border-coral/40 transition-colors"
          onClick={() => supabaseReady && fileRef.current?.click()}
          onKeyDown={(e) =>
            e.key === "Enter" && supabaseReady && fileRef.current?.click()
          }
          role="button"
          tabIndex={0}
          aria-label="Upload artwork image"
        >
          <Upload className="mx-auto text-teal/40 mb-2" size={28} aria-hidden="true" />
          <p className="text-sm text-teal/60">
            {uploading
              ? "Uploading..."
              : supabaseReady
                ? "Click to upload artwork image"
                : "Connect Supabase to enable uploads"}
          </p>
          <p className="text-xs text-teal/40 mt-1">JPEG, PNG, or WebP · Max 15 MB</p>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      {error && (
        <p className="text-red-600 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
