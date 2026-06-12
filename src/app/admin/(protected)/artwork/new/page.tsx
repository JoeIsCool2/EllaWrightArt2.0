import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEnvSetupStatus } from "@/lib/env";
import { AdminArtworkFormWrapper } from "@/components/admin/AdminArtworkFormWrapper";
import { AdminUploadNotice } from "@/components/admin/AdminUploadNotice";

export default async function NewArtworkPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const envStatus = getEnvSetupStatus();

  return (
    <div>
      <AdminUploadNotice status={envStatus} />
      <h1 className="font-serif text-3xl sm:text-4xl text-teal mb-2">Add New Artwork</h1>
      <p className="text-teal/60 mb-8 max-w-2xl">
        Upload your painting, add the details, preview how it will look, then save to
        publish it to your gallery.
      </p>
      <AdminArtworkFormWrapper mode="create" />
    </div>
  );
}
