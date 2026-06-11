import Link from "next/link";
import type { EnvSetupStatus } from "@/lib/env";
import { getSupabaseConfigError } from "@/lib/supabase/env";

interface AdminSetupPanelProps {
  status: EnvSetupStatus;
}

function EnvVarList({ vars }: { vars: string[] }) {
  if (vars.length === 0) return null;
  return (
    <ul className="mt-3 space-y-1.5 text-left max-w-md mx-auto">
      {vars.map((name) => (
        <li
          key={name}
          className="font-mono text-xs bg-teal/5 border border-teal/10 rounded-lg px-3 py-2 text-teal"
        >
          {name}
        </li>
      ))}
    </ul>
  );
}

export function AdminSetupPanel({ status }: AdminSetupPanelProps) {
  const configError = getSupabaseConfigError();
  const missing = status.missingSupabase;

  return (
    <div className="max-w-xl mx-auto text-center py-12 px-4">
      <h1 className="font-serif text-3xl text-teal mb-3">Admin Setup Required</h1>
      <p className="text-teal/70 leading-relaxed mb-6">
        The public site can run with bundled sample artwork, but the admin dashboard
        needs Supabase configured in your environment variables.
      </p>

      {missing.length > 0 ? (
        <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-soft)] mb-6">
          <p className="text-sm font-medium text-teal mb-1">Missing variables</p>
          <p className="text-sm text-teal/60 mb-2">
            Add these in Vercel → Settings → Environment Variables, then redeploy:
          </p>
          <EnvVarList vars={missing} />
        </div>
      ) : configError ? (
        <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-soft)] mb-6 text-left">
          <p className="text-sm font-medium text-teal mb-2">Configuration issue</p>
          <p className="text-sm text-teal/70 leading-relaxed">{configError}</p>
        </div>
      ) : null}

      <div className="bg-cream/50 rounded-2xl p-6 text-left text-sm text-teal/70 space-y-3 mb-8">
        <p className="font-medium text-teal">Quick checklist</p>
        <ol className="list-decimal list-inside space-y-2 leading-relaxed">
          <li>
            Set <code className="text-xs bg-white px-1.5 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> to{" "}
            <code className="text-xs bg-white px-1.5 py-0.5 rounded">https://yourproject.supabase.co</code>{" "}
            (no <code className="text-xs">/rest/v1</code>)
          </li>
          <li>
            Set <code className="text-xs bg-white px-1.5 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> from
            Supabase → Project Settings → API
          </li>
          <li>Run SQL migrations in Supabase (see README)</li>
          <li>Create an admin user in Supabase → Authentication → Users</li>
          <li>
            Add Supabase Auth redirect URLs:{" "}
            <code className="text-xs bg-white px-1.5 py-0.5 rounded break-all">
              https://ella-wright-art2-0.vercel.app/**
            </code>
          </li>
          <li>Redeploy on Vercel after saving env vars</li>
        </ol>
      </div>

      {!status.resendReady && (
        <p className="text-sm text-teal/60 mb-6">
          Forms also need: {status.missingResend.join(", ")} (see README)
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/admin/login"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-teal text-white text-sm font-medium hover:bg-teal-light transition-colors"
        >
          Try Admin Login
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-teal/20 text-teal text-sm font-medium hover:border-coral/40 transition-colors"
        >
          View Public Site
        </Link>
      </div>
    </div>
  );
}
