import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEnvSetupStatus } from "@/lib/env";
import { getAdminArtworkById } from "@/lib/artworks/service";
import { AdminArtworkFormWrapper } from "@/components/admin/AdminArtworkFormWrapper";
import { AdminUploadNotice } from "@/components/admin/AdminUploadNotice";

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
  const artwork = await getAdminArtworkById(id);

  if (!artwork) notFound();

  const envStatus = getEnvSetupStatus();

  return (
    <div>
      <AdminUploadNotice status={envStatus} />
      <h1 className="font-serif text-3xl sm:text-4xl text-teal mb-2">Edit Artwork</h1>
      <p className="text-teal/60 mb-8">{artwork.title}</p>
      <AdminArtworkFormWrapper artwork={artwork} mode="edit" />
    </div>
  );
}
