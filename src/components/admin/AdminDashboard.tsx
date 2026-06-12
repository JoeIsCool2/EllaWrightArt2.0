"use client";

import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import type { Artwork } from "@/lib/artworks/types";
import { getArtworkDescription } from "@/lib/artworks/display";
import { Button } from "@/components/ui/Button";
import { AdminArtworkList } from "./AdminArtworkList";

interface AdminDashboardProps {
  artworks: Artwork[];
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-[var(--shadow-soft)] border border-teal/5">
      <p className="text-xs font-medium uppercase tracking-wider text-teal/50 mb-1">
        {label}
      </p>
      <p className="font-serif text-3xl text-teal">{value}</p>
      {hint && <p className="text-xs text-teal/50 mt-1">{hint}</p>}
    </div>
  );
}

export function AdminDashboard({ artworks }: AdminDashboardProps) {
  const featured = artworks.filter((a) => a.is_featured).length;
  const available = artworks.filter((a) => a.is_available).length;
  const missingDescriptions = artworks.filter((a) => !getArtworkDescription(a)).length;
  const missingImages = artworks.filter(
    (a) => !a.image_url || a.image_url.startsWith("blob:")
  ).length;

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/artworks/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to delete artwork.");
    }
  }

  async function handleReorder(
    items: { id: string; display_order: number }[]
  ) {
    const res = await fetch("/api/admin/artworks/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to reorder artwork.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-teal mb-2">
            EllaWrightsArt Admin
          </h1>
          <p className="text-teal/65 max-w-xl leading-relaxed">
            Manage artwork, images, availability, and homepage features. Changes
            appear on the public gallery within about a minute.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/admin/artwork/new" variant="primary">
            <Plus size={18} className="mr-2" aria-hidden="true" />
            Add Artwork
          </Button>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-teal/20 text-teal text-sm font-medium hover:border-coral/40 hover:text-coral transition-colors"
          >
            <ExternalLink size={16} className="mr-2" aria-hidden="true" />
            View Live Site
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard label="Total Artworks" value={artworks.length} />
        <StatCard label="Featured" value={featured} />
        <StatCard label="Available" value={available} />
        <StatCard
          label="Missing Descriptions"
          value={missingDescriptions}
          hint="Optional — blank is fine"
        />
        <StatCard
          label="Missing Images"
          value={missingImages}
          hint={missingImages > 0 ? "Needs attention" : "All set"}
        />
      </div>

      <AdminArtworkList
        artworks={artworks}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />
    </div>
  );
}
