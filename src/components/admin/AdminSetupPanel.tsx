import Link from "next/link";
import type { EnvSetupStatus } from "@/lib/env";
import { getSupabaseConfigError } from "@/lib/supabase/env";

interface AdminSetupPanelProps {
  status: EnvSetupStatus;
}

function EnvVarList({ vars, title }: { vars: string[]; title: string }) {
  if (vars.length === 0) return null;
  return (
    <div className="mt-4">
      <p className="text-xs font-medium text-teal/70 uppercase tracking-wider mb-2">
        {title}
      </p>
      <ul className="space-y-1.5 text-left">
        {vars.map((name) => (
          <li
            key={name}
            className="font-mono text-xs bg-teal/5 border border-teal/10 rounded-lg px-3 py-2 text-teal"
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminSetupPanel({ status }: AdminSetupPanelProps) {
  const configError = getSupabaseConfigError();
  const hasMissingSupabase = status.missingSupabase.length > 0;

  return (
    <div className="max-w-2xl mx-auto py-8 md:py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl text-teal mb-3">
          Supabase is not connected yet
        </h1>
        <p className="text-teal/70 leading-relaxed max-w-lg mx-auto">
          The public site can run with bundled sample artwork, but the admin
          dashboard needs Supabase to manage your real gallery. Add the variables
          below in Vercel, then redeploy.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-teal/5 mb-6 text-left">
        <p className="text-sm font-medium text-teal mb-1">
          {hasMissingSupabase ? "Missing environment variables" : "Configuration issue"}
        </p>
        <p className="text-sm text-teal/60 mb-2">
          Vercel → Project → Settings → Environment Variables → Redeploy
        </p>

        <EnvVarList vars={status.missingSupabase} title="Required for admin login" />
        <EnvVarList
          vars={status.missingServiceRole}
          title="Required for image uploads (server-only)"
        />

        {!hasMissingSupabase && configError && (
          <p className="text-sm text-teal/70 leading-relaxed mt-4 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
            {configError}
          </p>
        )}

        <EnvVarList
          vars={status.missingResend}
          title="Required for contact & commission forms"
        />
        <EnvVarList vars={status.missingContact} title="Recommended contact recipient" />
        <EnvVarList vars={status.missingSite} title="Recommended for SEO" />
      </div>

      <div className="bg-cream/50 rounded-2xl p-6 text-left text-sm text-teal/70 space-y-4 mb-8 border border-teal/5">
        <div>
          <p className="font-medium text-teal mb-2">Supabase setup checklist</p>
          <ol className="list-decimal list-inside space-y-1.5 text-teal/65">
            <li>Run migrations <code className="text-xs bg-white px-1 rounded">001_artworks.sql</code> and <code className="text-xs bg-white px-1 rounded">002_object_position.sql</code></li>
            <li>Run <code className="text-xs bg-white px-1 rounded">004_storage_bucket.sql</code> for the artwork-images bucket</li>
            <li>Create an admin user in Authentication → Users</li>
            <li>Configure Auth URLs below</li>
          </ol>
        </div>

        <div>
          <p className="font-medium text-teal mb-2">Supabase Auth URLs</p>
          <p>
            <span className="text-teal/60">Site URL:</span>{" "}
            <code className="text-xs bg-white px-1.5 py-0.5 rounded break-all">
              https://ella-wright-art2-0.vercel.app
            </code>
          </p>
          <p className="text-teal/60 mt-2">Redirect URLs:</p>
          <ul className="font-mono text-xs space-y-1 bg-white rounded-lg p-3 border border-teal/10 mt-1">
            <li>https://ella-wright-art2-0.vercel.app/**</li>
            <li>http://localhost:3000/**</li>
            <li>http://localhost:3001/**</li>
          </ul>
        </div>

        <p>
          Form emails go to{" "}
          <a
            href="mailto:ellawright.artist@gmail.com"
            className="text-coral hover:underline"
          >
            ellawright.artist@gmail.com
          </a>{" "}
          when <code className="text-xs bg-white px-1 rounded">CONTACT_EMAIL</code> and Resend are set.
        </p>
      </div>

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
