import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllArtworks } from "@/lib/artworks/service";
import { AdminArtworkFormWrapper } from "@/components/admin/AdminArtworkFormWrapper";

interface EditArtworkPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArtworkPage({ params }: EditArtworkPageProps) {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const artworks = await getAllArtworks();
  const artwork = artworks.find((a) => a.id === id);

  if (!artwork) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl text-teal mb-8">Edit Artwork</h1>
      <AdminArtworkFormWrapper artwork={artwork} mode="edit" />
    </div>
  );
}
