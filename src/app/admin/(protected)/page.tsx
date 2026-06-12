import { redirect } from "next/navigation";
import { getAdminArtworks } from "@/lib/artworks/service";
import { getEnvSetupStatus } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminSetupPanel } from "@/components/admin/AdminSetupPanel";
import { AdminUploadNotice } from "@/components/admin/AdminUploadNotice";

export default async function AdminPage() {
  const envStatus = getEnvSetupStatus();

  if (!isSupabaseConfigured()) {
    return <AdminSetupPanel status={envStatus} />;
  }

  const supabase = await createClient();
  if (!supabase) {
    return <AdminSetupPanel status={envStatus} />;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const artworks = await getAdminArtworks();

  return (
    <>
      <AdminUploadNotice status={envStatus} />
      <AdminDashboard artworks={artworks} />
    </>
  );
}
