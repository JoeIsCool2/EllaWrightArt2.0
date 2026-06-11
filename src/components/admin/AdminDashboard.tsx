"use client";

import { AdminArtworkList } from "./AdminArtworkList";
import type { Artwork } from "@/lib/artworks/types";

interface AdminDashboardProps {
  artworks: Artwork[];
}

export function AdminDashboard({ artworks }: AdminDashboardProps) {
  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/artworks/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to delete");
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
      throw new Error(data.error || "Failed to reorder");
    }
  }

  return (
    <AdminArtworkList
      artworks={artworks}
      onDelete={handleDelete}
      onReorder={handleReorder}
    />
  );
}
