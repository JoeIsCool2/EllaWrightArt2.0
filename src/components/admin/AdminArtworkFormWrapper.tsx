"use client";

import { useRouter } from "next/navigation";
import type { Artwork } from "@/lib/artworks/types";
import { AdminArtworkForm } from "./AdminArtworkForm";

interface AdminArtworkFormWrapperProps {
  artwork?: Artwork;
  mode: "create" | "edit";
}

export function AdminArtworkFormWrapper({
  artwork,
  mode,
}: AdminArtworkFormWrapperProps) {
  const router = useRouter();

  async function handleSave(data: Record<string, unknown>) {
    const url =
      mode === "create"
        ? "/api/admin/artworks"
        : `/api/admin/artworks/${artwork?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.error || "Failed to save artwork");
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <AdminArtworkForm
      artwork={artwork}
      onSave={handleSave}
      onCancel={() => router.push("/admin")}
    />
  );
}
