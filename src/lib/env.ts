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

const RESEND_EMAIL_ONLY =
  /^[^\s<>"']+@[^\s<>"']+\.[^\s<>"']+$/;
const RESEND_NAMED_FORMAT =
  /^[^<>]+<[^\s<>"']+@[^\s<>"']+\.[^\s<>"']+>$/;

function stripWrappingQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1).trim();
  }
  return value;
}

function normalizeFromInput(value: string): string {
  return value
    .replace(/^mailto:/i, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[‹›]/g, (char) => (char === "‹" ? "<" : ">"))
    .trim();
}

/** Resend `from` address — server only. Falls back safely if env format is wrong. */
export function getResendFromEmail(): string {
  const fallback = "EllaWrightArt <onboarding@resend.dev>";
  const raw = process.env.RESEND_FROM_EMAIL?.trim();

  if (!raw || isPlaceholder(raw)) {
    return fallback;
  }

  const value = normalizeFromInput(stripWrappingQuotes(raw));

  if (RESEND_EMAIL_ONLY.test(value)) {
    return `EllaWrightArt <${value}>`;
  }

  if (RESEND_NAMED_FORMAT.test(value)) {
    return value;
  }

  // "Name email@domain.com" without angle brackets
  const looseMatch = value.match(
    /^(.+?)\s+([^\s<>"']+@[^\s<>"']+\.[^\s<>"']+)$/
  );
  if (looseMatch) {
    return `${looseMatch[1].trim()} <${looseMatch[2]}>`;
  }

  // Extract any email address buried in the string
  const emailMatch = value.match(
    /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/
  );
  if (emailMatch) {
    return `EllaWrightArt <${emailMatch[0]}>`;
  }

  console.warn(
    "[email] RESEND_FROM_EMAIL could not be parsed; using Resend test sender."
  );
  return fallback;
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
