"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, ChevronUp, ChevronDown, Plus } from "lucide-react";
import type { Artwork } from "@/lib/artworks/types";
import { getCategoryLabel } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface AdminArtworkListProps {
  artworks: Artwork[];
  onDelete: (id: string) => Promise<void>;
  onReorder: (items: { id: string; display_order: number }[]) => Promise<void>;
}

export function AdminArtworkList({
  artworks: initialArtworks,
  onDelete,
  onReorder,
}: AdminArtworkListProps) {
  const [artworks, setArtworks] = useState(initialArtworks);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this artwork?")) return;
    setDeleting(id);
    setError("");
    try {
      await onDelete(id);
      setArtworks((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete artwork.");
    } finally {
      setDeleting(null);
    }
  }

  async function moveItem(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= artworks.length) return;

    const previous = [...artworks];
    const updated = [...artworks];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    const reordered = updated.map((a, i) => ({ ...a, display_order: i + 1 }));

    setArtworks(reordered);
    setReordering(true);
    setError("");

    try {
      await onReorder(
        reordered.map((a) => ({ id: a.id, display_order: a.display_order }))
      );
    } catch (err) {
      setArtworks(previous);
      setError(err instanceof Error ? err.message : "Failed to reorder artwork.");
    } finally {
      setReordering(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="font-serif text-3xl text-teal">Artwork Dashboard</h1>
        <Button href="/admin/artwork/new" variant="primary">
          <Plus size={18} className="mr-2" aria-hidden="true" />
          Add Artwork
        </Button>
      </div>

      {error && (
        <p className="mb-4 text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3" role="alert">
          {error}
        </p>
      )}

      {reordering && (
        <p className="mb-4 text-teal/60 text-sm" aria-live="polite">
          Saving new order...
        </p>
      )}

      {artworks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-[var(--shadow-soft)]">
          <p className="font-serif text-xl text-teal mb-2">No artwork yet</p>
          <p className="text-teal/60 mb-6 max-w-sm mx-auto">
            Upload your first piece to replace the sample gallery on the public
            site.
          </p>
          <Button href="/admin/artwork/new" variant="coral">
            Add Your First Artwork
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {artworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className="flex items-center gap-3 sm:gap-4 bg-white rounded-xl p-3 sm:p-4 shadow-[var(--shadow-soft)]"
            >
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0 || reordering}
                  className="text-teal/40 hover:text-teal disabled:opacity-30 p-1"
                  aria-label={`Move ${artwork.title} up`}
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, "down")}
                  disabled={index === artworks.length - 1 || reordering}
                  className="text-teal/40 hover:text-teal disabled:opacity-30 p-1"
                  aria-label={`Move ${artwork.title} down`}
                >
                  <ChevronDown size={16} />
                </button>
              </div>

              <div className="relative w-14 h-[4.5rem] sm:w-16 sm:h-20 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={artwork.image_url}
                  alt={artwork.image_alt}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-base sm:text-lg text-teal truncate">
                  {artwork.title}
                </h3>
                <p className="text-xs sm:text-sm text-teal/60 truncate">
                  {getCategoryLabel(artwork.category)} • {artwork.year}
                  {artwork.is_featured && " • Featured"}
                  {artwork.is_available && " • Available"}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href={`/admin/artwork/${artwork.id}/edit`}
                  className="p-2 text-teal hover:text-coral transition-colors"
                  aria-label={`Edit ${artwork.title}`}
                >
                  <Pencil size={18} />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(artwork.id)}
                  disabled={deleting === artwork.id}
                  className="p-2 text-teal/50 hover:text-red-500 transition-colors disabled:opacity-50"
                  aria-label={`Delete ${artwork.title}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
