import type { EnvSetupStatus } from "@/lib/env";

export function AdminUploadNotice({ status }: { status: EnvSetupStatus }) {
  if (!status.supabaseReady) {
    return (
      <div
        className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        role="status"
      >
        <p className="font-medium">Supabase is not connected.</p>
        <p className="mt-1 text-amber-800/90">
          Add{" "}
          <code className="text-xs bg-white/80 px-1 rounded">
            {status.missingSupabase.join(", ") || "Supabase env vars"}
          </code>{" "}
          in Vercel Environment Variables, then redeploy.
        </p>
      </div>
    );
  }

  if (status.missingServiceRole.length === 0) return null;

  return (
    <div
      className="mb-6 rounded-xl border border-teal/10 bg-cream/50 px-4 py-3 text-sm text-teal/80"
      role="status"
    >
      <p className="font-medium text-teal">Optional: add service role key for uploads</p>
      <p className="mt-1">
        Uploads can work while you are logged in. For the most reliable production uploads,
        add <code className="text-xs bg-white/80 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
        in Vercel and run{" "}
        <code className="text-xs bg-white/80 px-1 rounded">004_storage_bucket.sql</code>.
      </p>
    </div>
  );
}
