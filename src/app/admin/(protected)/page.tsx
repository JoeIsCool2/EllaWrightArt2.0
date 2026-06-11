import { redirect } from "next/navigation";
import { getAdminArtworks } from "@/lib/artworks/service";
import { createClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="text-center py-20">
        <h1 className="font-serif text-2xl text-teal mb-4">
          Admin Setup Required
        </h1>
        <p className="text-teal/60 max-w-md mx-auto leading-relaxed">
          Connect Supabase to manage artwork. Add your environment variables,
          run the database migration, and create an admin user. See README.md
          for step-by-step instructions.
        </p>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const artworks = await getAdminArtworks();

  return <AdminDashboard artworks={artworks} />;
}
