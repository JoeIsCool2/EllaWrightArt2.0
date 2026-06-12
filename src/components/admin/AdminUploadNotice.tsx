import type { EnvSetupStatus } from "@/lib/env";

export function AdminUploadNotice({ status }: { status: EnvSetupStatus }) {
  if (status.uploadsReady) return null;

  return (
    <div
      className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
      role="status"
    >
      <p className="font-medium">Image uploads are not fully configured.</p>
      <p className="mt-1 text-amber-800/90">
        Add{" "}
        {status.missingServiceRole.length > 0 ? (
          <code className="text-xs bg-white/80 px-1 rounded">
            {status.missingServiceRole.join(", ")}
          </code>
        ) : (
          "the required Supabase variables"
        )}{" "}
        in Vercel Environment Variables, run migration{" "}
        <code className="text-xs bg-white/80 px-1 rounded">004_storage_bucket.sql</code>,
        then redeploy.
      </p>
    </div>
  );
}
