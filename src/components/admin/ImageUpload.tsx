"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, RefreshCw } from "lucide-react";
import {
  ALLOWED_ARTWORK_MIME_TYPES,
  MAX_ARTWORK_FILE_BYTES,
} from "@/lib/validation";

interface ImageUploadProps {
  value: string;
  slug: string;
  onChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
  onUploadError?: (message: string) => void;
}

const MAX_MB = Math.round(MAX_ARTWORK_FILE_BYTES / (1024 * 1024));
const ACCEPT = ALLOWED_ARTWORK_MIME_TYPES.join(",");

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImageUpload({
  value,
  slug,
  onChange,
  onAltChange,
  onUploadError,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const reportError = useCallback(
    (message: string) => {
      setError(message);
      onUploadError?.(message);
    },
    [onUploadError]
  );

  async function uploadFile(file: File) {
    setUploading(true);
    setError("");
    setSelectedFile({ name: file.name, size: file.size });

    if (!(ALLOWED_ARTWORK_MIME_TYPES as readonly string[]).includes(file.type)) {
      reportError("Unsupported file type. Please upload JPG, JPEG, PNG, or WebP.");
      setUploading(false);
      return;
    }

    if (file.size > MAX_ARTWORK_FILE_BYTES) {
      reportError(`Image must be ${MAX_MB} MB or smaller.`);
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("slug", slug || "artwork");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        reportError(result.error || "Upload failed. Please try again.");
        setUploading(false);
        return;
      }

      onChange(result.url);
      onAltChange?.(
        file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")
      );
      setSelectedFile(null);
    } catch {
      reportError("Network error while uploading. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleFileSelect(file: File | undefined) {
    if (file) uploadFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }

  return (
    <div className="space-y-3">
      {value ? (
        <div className="space-y-3">
          <div className="relative w-full aspect-[4/5] max-w-sm rounded-xl overflow-hidden border border-teal/10 bg-cream/30 shadow-[var(--shadow-soft)]">
            <Image
              src={value}
              alt="Artwork preview"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, 320px"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-teal/20 text-teal hover:border-coral/40 hover:text-coral transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} aria-hidden="true" />
              {uploading ? "Uploading..." : "Replace Image"}
            </button>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setSelectedFile(null);
                setError("");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-teal/10 text-teal/60 hover:text-red-500 hover:border-red-200 transition-colors"
            >
              <X size={16} aria-hidden="true" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragOver
              ? "border-coral/50 bg-coral/5"
              : "border-teal/20 hover:border-coral/40"
          } ${uploading ? "opacity-70 pointer-events-none" : "cursor-pointer"}`}
          onClick={() => !uploading && fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload artwork image"
        >
          <Upload className="mx-auto text-teal/40 mb-3" size={32} aria-hidden="true" />
          <p className="text-sm font-medium text-teal">
            {uploading ? "Uploading your image..." : "Drag & drop or click to upload"}
          </p>
          <p className="text-xs text-teal/50 mt-2">
            JPG, JPEG, PNG, or WebP · Max {MAX_MB} MB
          </p>
          {selectedFile && uploading && (
            <p className="text-xs text-teal/60 mt-3">
              {selectedFile.name} · {formatFileSize(selectedFile.size)}
            </p>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          handleFileSelect(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
