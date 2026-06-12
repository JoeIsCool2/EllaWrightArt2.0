"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  ExternalLink,
  GripVertical,
} from "lucide-react";
import type { Artwork } from "@/lib/artworks/types";
import { getCategoryLabel } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { AdminDeleteModal } from "./AdminDeleteModal";

interface AdminArtworkListProps {
  artworks: Artwork[];
  onDelete: (id: string) => Promise<void>;
  onReorder: (items: { id: string; display_order: number }[]) => Promise<void>;
}

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "coral" | "teal";
}) {
  const styles = {
    default: "bg-teal/5 text-teal/70 border-teal/10",
    coral: "bg-coral/10 text-coral border-coral/20",
    teal: "bg-teal/10 text-teal border-teal/15",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

export function AdminArtworkList({
  artworks: initialArtworks,
  onDelete,
  onReorder,
}: AdminArtworkListProps) {
  const [artworks, setArtworks] = useState(initialArtworks);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Artwork | null>(null);
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function showSuccess(message: string) {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    setError("");

    try {
      await onDelete(deleteTarget.id);
      setArtworks((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      showSuccess(`"${deleteTarget.title}" was deleted.`);
      setDeleteTarget(null);
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
      showSuccess("Gallery order updated.");
    } catch (err) {
      setArtworks(previous);
      setError(err instanceof Error ? err.message : "Failed to reorder artwork.");
    } finally {
      setReordering(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="font-serif text-2xl text-teal">Your Artwork</h2>
        {artworks.length > 0 && (
          <p className="text-xs text-teal/50 hidden sm:block">
            Use arrows to reorder · Lower numbers appear first
          </p>
        )}
      </div>

      {error && (
        <p
          className="mb-4 text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3"
          role="alert"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          className="mb-4 text-teal text-sm bg-teal/5 border border-teal/10 rounded-lg px-4 py-3"
          role="status"
        >
          {success}
        </p>
      )}

      {reordering && (
        <p className="mb-4 text-teal/60 text-sm" aria-live="polite">
          Saving new order...
        </p>
      )}

      {artworks.length === 0 ? (
        <div className="text-center py-16 sm:py-20 bg-white rounded-2xl shadow-[var(--shadow-soft)] border border-teal/5">
          <p className="font-serif text-2xl text-teal mb-2">No artwork uploaded yet</p>
          <p className="text-teal/60 mb-8 max-w-sm mx-auto leading-relaxed">
            Upload your first piece to replace the sample gallery on the public site.
          </p>
          <Button href="/admin/artwork/new" variant="coral">
            <Plus size={18} className="mr-2" aria-hidden="true" />
            Add First Artwork
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {artworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className="flex items-start sm:items-center gap-2 sm:gap-4 bg-white rounded-xl p-3 sm:p-4 shadow-[var(--shadow-soft)] border border-teal/5"
            >
              <div className="flex flex-col items-center gap-1 shrink-0 pt-1 sm:pt-0">
                <GripVertical
                  size={14}
                  className="text-teal/25 hidden sm:block"
                  aria-hidden="true"
                />
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

              <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-cream/40">
                <Image
                  src={artwork.image_url}
                  alt={artwork.image_alt || artwork.title}
                  fill
                  className="object-cover"
                  style={{ objectPosition: artwork.object_position || "center center" }}
                  sizes="80px"
                />
              </div>

              <div className="flex-1 min-w-0 py-0.5">
                <h3 className="font-serif text-base sm:text-lg text-teal leading-snug line-clamp-2">
                  {artwork.title}
                </h3>
                <p className="text-xs sm:text-sm text-teal/60 mt-1">
                  {getCategoryLabel(artwork.category)} · {artwork.size} · {artwork.year}
                </p>
                <p className="text-xs text-teal/45 mt-0.5 hidden sm:block">
                  {artwork.medium}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {artwork.is_available && <Badge variant="coral">Available</Badge>}
                  {artwork.is_featured && <Badge variant="teal">Featured</Badge>}
                  {artwork.show_on_home && <Badge>On Home</Badge>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 shrink-0">
                <Link
                  href={`/gallery/${artwork.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-teal/50 hover:text-teal transition-colors"
                  aria-label={`Preview ${artwork.title}`}
                  title="Preview on site"
                >
                  <ExternalLink size={17} />
                </Link>
                <Link
                  href={`/admin/artwork/${artwork.id}/edit`}
                  className="p-2 text-teal hover:text-coral transition-colors"
                  aria-label={`Edit ${artwork.title}`}
                >
                  <Pencil size={17} />
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(artwork)}
                  disabled={deleting === artwork.id}
                  className="p-2 text-teal/50 hover:text-red-500 transition-colors disabled:opacity-50"
                  aria-label={`Delete ${artwork.title}`}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminDeleteModal
        open={Boolean(deleteTarget)}
        title={deleteTarget?.title ?? ""}
        loading={Boolean(deleting)}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
