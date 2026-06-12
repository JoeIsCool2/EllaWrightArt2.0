"use client";

import { useState } from "react";
import Image from "next/image";
import type { Artwork, ArtworkCategory } from "@/lib/artworks/types";
import { ARTWORK_CATEGORIES } from "@/lib/constants";
import {
  DEFAULT_OBJECT_POSITION,
  getArtworkDescription,
} from "@/lib/artworks/display";
import { slugify, formatArtworkMeta } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "./ImageUpload";

interface AdminArtworkFormProps {
  artwork?: Artwork;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}

const FOCAL_PRESETS = [
  { label: "Center", value: "center center" },
  { label: "Top", value: "center top" },
  { label: "Bottom", value: "center bottom" },
  { label: "Left", value: "left center" },
  { label: "Right", value: "right center" },
  { label: "50% 25%", value: "50% 25%" },
  { label: "50% 35%", value: "50% 35%" },
  { label: "50% 65%", value: "50% 65%" },
];

export function AdminArtworkForm({
  artwork,
  onSave,
  onCancel,
}: AdminArtworkFormProps) {
  const [title, setTitle] = useState(artwork?.title || "");
  const [slug, setSlug] = useState(artwork?.slug || "");
  const [category, setCategory] = useState<ArtworkCategory>(
    artwork?.category || "spiritual"
  );
  const [medium, setMedium] = useState(artwork?.medium || "Oil on Canvas");
  const [size, setSize] = useState(artwork?.size || "");
  const [year, setYear] = useState(artwork?.year || new Date().getFullYear());
  const [description, setDescription] = useState(artwork?.description || "");
  const [imageUrl, setImageUrl] = useState(artwork?.image_url || "");
  const [imageAlt, setImageAlt] = useState(artwork?.image_alt || "");
  const [objectPosition, setObjectPosition] = useState(
    artwork?.object_position || DEFAULT_OBJECT_POSITION
  );
  const [isAvailable, setIsAvailable] = useState(artwork?.is_available ?? false);
  const [isFeatured, setIsFeatured] = useState(artwork?.is_featured ?? false);
  const [showOnHome, setShowOnHome] = useState(artwork?.show_on_home ?? false);
  const [displayOrder, setDisplayOrder] = useState(artwork?.display_order || 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");

  const previewArtwork: Artwork = {
    id: artwork?.id || "preview",
    title: title || "Untitled",
    slug: slug || "untitled",
    category,
    medium,
    size: size || '24" x 30"',
    year,
    description,
    image_url: imageUrl,
    image_alt: imageAlt || title,
    object_position: objectPosition,
    is_available: isAvailable,
    is_featured: isFeatured,
    show_on_home: showOnHome,
    display_order: displayOrder,
    created_at: artwork?.created_at || "",
    updated_at: artwork?.updated_at || "",
  };

  const descriptionPreview = getArtworkDescription(previewArtwork);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!artwork) setSlug(slugify(val));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!imageUrl || imageUrl.startsWith("blob:")) {
      setError("Please upload an artwork image before saving.");
      setSaving(false);
      return;
    }

    if (!title.trim() || !slug.trim() || !size.trim() || !medium.trim()) {
      setError("Please complete all required fields (title, slug, medium, size, year, image).");
      setSaving(false);
      return;
    }

    try {
      await onSave({
        title,
        slug,
        category,
        medium,
        size,
        year,
        description,
        image_url: imageUrl,
        image_alt: imageAlt || title,
        object_position: objectPosition || DEFAULT_OBJECT_POSITION,
        is_available: isAvailable,
        is_featured: isFeatured,
        show_on_home: showOnHome,
        display_order: displayOrder,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save artwork.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-10">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-teal mb-1.5">
              Title <span className="text-coral">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="input-field"
              placeholder="Heavenly Hands"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-teal mb-1.5">
              Slug <span className="text-coral">*</span>
            </label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="input-field"
              placeholder="heavenly-hands"
            />
            <p className="text-xs text-teal/50 mt-1.5">
              Used in the gallery URL. Auto-generated from title; edit if needed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-teal mb-1.5">
                Category <span className="text-coral">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ArtworkCategory)}
                className="input-field"
              >
                {ARTWORK_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-teal mb-1.5">
                Year <span className="text-coral">*</span>
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                required
                min={1900}
                max={2100}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-teal mb-1.5">
                Medium <span className="text-coral">*</span>
              </label>
              <input
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-teal mb-1.5">
                Size <span className="text-coral">*</span>
              </label>
              <input
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
                placeholder={'24" x 30"'}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-teal mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Optional — leave blank to hide on the artwork page."
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-teal mb-1.5">
              Image Alt Text
            </label>
            <input
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              className="input-field"
              placeholder="Describe the painting for accessibility"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-teal mb-1.5">
              Card Crop Focal Point
            </label>
            <p className="text-xs text-teal/55 mb-2 leading-relaxed">
              Use this if the gallery card crop cuts off an important face or subject.
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {FOCAL_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setObjectPosition(preset.value)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                    objectPosition === preset.value
                      ? "bg-teal text-white border-teal"
                      : "border-teal/20 text-teal/70 hover:border-coral/40"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <input
              value={objectPosition}
              onChange={(e) => setObjectPosition(e.target.value)}
              placeholder="center center"
              className="input-field"
            />
          </div>

          <div className="bg-cream/40 rounded-xl p-4 border border-teal/5 space-y-3">
            <p className="text-sm font-medium text-teal">Visibility</p>
            <label className="flex items-center gap-2.5 text-sm text-teal cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="rounded border-teal/30 text-coral focus:ring-coral"
              />
              Available for purchase
            </label>
            <label className="flex items-center gap-2.5 text-sm text-teal cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-teal/30 text-coral focus:ring-coral"
              />
              Featured artwork (homepage hero candidate)
            </label>
            <label className="flex items-center gap-2.5 text-sm text-teal cursor-pointer">
              <input
                type="checkbox"
                checked={showOnHome}
                onChange={(e) => setShowOnHome(e.target.checked)}
                className="rounded border-teal/30 text-coral focus:ring-coral"
              />
              Show on homepage category section
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-teal mb-1.5">
              Display Order
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="input-field w-32"
            />
            <p className="text-xs text-teal/50 mt-1.5">
              Lower numbers appear first in the gallery.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 shadow-[var(--shadow-soft)] border border-teal/5">
            <label className="block text-sm font-medium text-teal mb-3">
              Artwork Image <span className="text-coral">*</span>
            </label>
            <ImageUpload
              value={imageUrl}
              slug={slug || slugify(title) || "artwork"}
              onChange={(url) => {
                setImageUrl(url);
                setUploadError("");
              }}
              onAltChange={setImageAlt}
              onUploadError={setUploadError}
            />
            {uploadError && (
              <p className="text-red-600 text-sm mt-3" role="alert">
                {uploadError}
              </p>
            )}
          </div>

          {imageUrl && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] border border-teal/5">
                <p className="text-xs font-medium text-teal/60 uppercase tracking-wider px-4 pt-4 pb-2">
                  Gallery Card Preview
                </p>
                <div className="relative aspect-[4/5] bg-cream/40 mx-4 rounded-xl overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={imageAlt || title || "Preview"}
                    fill
                    className="object-cover"
                    style={{ objectPosition }}
                    sizes="(max-width: 640px) 100vw, 400px"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg text-teal line-clamp-3">
                    {title || "Untitled"}
                  </h3>
                  <p className="text-sm text-teal/60 mt-1">
                    {formatArtworkMeta(previewArtwork)}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {isAvailable && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-coral/10 text-coral">
                        Available
                      </span>
                    )}
                    {isFeatured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-teal/10 text-teal">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] border border-teal/5">
                <p className="text-xs font-medium text-teal/60 uppercase tracking-wider px-4 pt-4 pb-2">
                  Detail Page Preview
                </p>
                <div className="relative aspect-[3/4] max-h-[420px] bg-cream/30 mx-4 rounded-xl overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={imageAlt || title || "Preview"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, 400px"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-serif text-xl text-teal">{title || "Untitled"}</h3>
                  <p className="text-sm text-teal/60">{formatArtworkMeta(previewArtwork)}</p>
                  {descriptionPreview ? (
                    <p className="text-sm text-teal/75 leading-relaxed whitespace-pre-line pt-2">
                      {descriptionPreview}
                    </p>
                  ) : (
                    <p className="text-xs text-teal/45 italic pt-2">
                      No description — section will be hidden on the public page.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {(error || uploadError) && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3" role="alert">
          {error || uploadError}
        </p>
      )}

      <div className="flex flex-wrap gap-3 pt-4 border-t border-teal/10 sticky bottom-0 bg-ivory/95 backdrop-blur-sm py-4 -mx-1 px-1">
        <Button
          type="submit"
          variant="primary"
          disabled={saving || !imageUrl || Boolean(uploadError)}
        >
          {saving ? "Saving..." : artwork ? "Save Changes" : "Save Artwork"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
