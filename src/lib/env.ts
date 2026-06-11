/**
 * Server-side environment diagnostics.
 * Never log or return secret values — only variable names.
 */

function isSet(name: string): boolean {
  const value = process.env[name]?.trim();
  return Boolean(value && !value.includes("your-") && !value.includes("xxxxx"));
}

export function getMissingSupabaseEnvVars(): string[] {
  const missing: string[] = [];
  if (!isSet("NEXT_PUBLIC_SUPABASE_URL")) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!isSet("NEXT_PUBLIC_SUPABASE_ANON_KEY")) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return missing;
}

export function getMissingResendEnvVars(): string[] {
  const missing: string[] = [];
  if (!isSet("RESEND_API_KEY")) missing.push("RESEND_API_KEY");
  if (!isSet("RESEND_FROM_EMAIL")) missing.push("RESEND_FROM_EMAIL");
  return missing;
}

export function getMissingPublicSiteEnvVars(): string[] {
  const missing: string[] = [];
  if (!isSet("NEXT_PUBLIC_SITE_URL")) missing.push("NEXT_PUBLIC_SITE_URL");
  return missing;
}

export interface EnvSetupStatus {
  supabaseReady: boolean;
  resendReady: boolean;
  missingSupabase: string[];
  missingResend: string[];
  missingSite: string[];
}

export function getEnvSetupStatus(): EnvSetupStatus {
  const missingSupabase = getMissingSupabaseEnvVars();
  const missingResend = getMissingResendEnvVars();
  const missingSite = getMissingPublicSiteEnvVars();

  return {
    supabaseReady: missingSupabase.length === 0,
    resendReady: missingResend.length === 0,
    missingSupabase,
    missingResend,
    missingSite,
  };
}
