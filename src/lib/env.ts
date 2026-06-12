/**
 * Server-side environment diagnostics.
 * Never log or return secret values — only variable names.
 */

import {
  normalizeSupabaseKey,
  normalizeSupabaseUrl,
} from "./supabase/env";

function isPlaceholder(value: string): boolean {
  return value.includes("your-") || value.includes("xxxxx");
}

export function getMissingSupabaseEnvVars(): string[] {
  const missing: string[] = [];
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!rawUrl || isPlaceholder(rawUrl)) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  } else if (!normalizeSupabaseUrl(rawUrl)) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!rawKey || isPlaceholder(rawKey)) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  } else if (!normalizeSupabaseKey(rawKey)) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return missing;
}

export function getMissingServiceRoleEnvVars(): string[] {
  const missing: string[] = [];
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key || isPlaceholder(key)) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }
  return missing;
}

export function getMissingResendEnvVars(): string[] {
  const missing: string[] = [];
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || isPlaceholder(apiKey)) missing.push("RESEND_API_KEY");
  if (!fromEmail || isPlaceholder(fromEmail)) missing.push("RESEND_FROM_EMAIL");
  return missing;
}

export function getMissingContactEnvVars(): string[] {
  const missing: string[] = [];
  const email = process.env.CONTACT_EMAIL?.trim();
  if (!email || isPlaceholder(email)) {
    missing.push("CONTACT_EMAIL");
  }
  return missing;
}

export function getContactEmail(): string {
  const email = process.env.CONTACT_EMAIL?.trim();
  if (email && !isPlaceholder(email)) return email;
  return "ellawright.artist@gmail.com";
}

export function getMissingPublicSiteEnvVars(): string[] {
  const missing: string[] = [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl || isPlaceholder(siteUrl)) {
    missing.push("NEXT_PUBLIC_SITE_URL");
  }
  return missing;
}

export interface EnvSetupStatus {
  supabaseReady: boolean;
  uploadsReady: boolean;
  resendReady: boolean;
  missingSupabase: string[];
  missingServiceRole: string[];
  missingResend: string[];
  missingContact: string[];
  missingSite: string[];
}

export function getEnvSetupStatus(): EnvSetupStatus {
  const missingSupabase = getMissingSupabaseEnvVars();
  const missingServiceRole = getMissingServiceRoleEnvVars();
  const missingResend = getMissingResendEnvVars();
  const missingContact = getMissingContactEnvVars();
  const missingSite = getMissingPublicSiteEnvVars();

  return {
    supabaseReady: missingSupabase.length === 0,
    uploadsReady: missingSupabase.length === 0,
    resendReady: missingResend.length === 0,
    missingSupabase,
    missingServiceRole,
    missingResend,
    missingContact,
    missingSite,
  };
}
