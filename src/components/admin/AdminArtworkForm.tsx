"use client";

import { useState } from "react";
import Image from "next/image";
import type { Artwork, ArtworkCategory } from "@/lib/artworks/types";
import { ARTWORK_CATEGORIES } from "@/lib/constants";
import { DEFAULT_OBJECT_POSITION } from "@/lib/artworks/display";
import { slugify } from "@/lib/utils";
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
  { label: "Upper", value: "center 25%" },
  { label: "Lower", value: "center 75%" },
  { label: "Bottom", value: "center bottom" },
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

    if (!title.trim() || !slug.trim() || !size.trim()) {
      setError("Please complete all required fields.");
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
      setError(err instanceof Error ? err.message : "Failed to save");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-teal mb-1.5">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-teal mb-1.5">
              Slug
            </label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-teal mb-1.5">
                Category
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
                Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                required
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-teal mb-1.5">
                Medium
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
                Size
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-teal mb-1.5">
              Card Crop Focal Point
            </label>
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
            <p className="text-xs text-teal/50 mt-1.5">
              CSS object-position for gallery cards (e.g. center 30%).
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-teal cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="rounded border-teal/30 text-coral focus:ring-coral"
              />
              Available
            </label>
            <label className="flex items-center gap-2 text-sm text-teal cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-teal/30 text-coral focus:ring-coral"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-teal cursor-pointer">
              <input
                type="checkbox"
                checked={showOnHome}
                onChange={(e) => setShowOnHome(e.target.checked)}
                className="rounded border-teal/30 text-coral focus:ring-coral"
              />
              Show on Home
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
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-teal mb-3">
              Artwork Image
            </label>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              onAltChange={setImageAlt}
            />
          </div>

          {imageUrl && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-soft)]">
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
                />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg text-teal">
                  {title || "Untitled"}
                </h3>
                <p className="text-sm text-teal/60 mt-1">
                  {size} • {year} • {medium}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 pt-4 border-t border-teal/10">
        <Button type="submit" variant="primary" disabled={saving || !imageUrl}>
          {saving ? "Saving..." : "Save Artwork"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
