import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminArtworkFormWrapper } from "@/components/admin/AdminArtworkFormWrapper";

export default async function NewArtworkPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div>
      <h1 className="font-serif text-3xl text-teal mb-8">Add New Artwork</h1>
      <AdminArtworkFormWrapper mode="create" />
    </div>
  );
}
