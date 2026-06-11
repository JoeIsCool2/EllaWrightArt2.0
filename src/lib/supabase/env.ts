export interface SupabaseEnv {
  url: string;
  key: string;
}

function stripQuotes(value: string): string {
  return value.replace(/^["']|["']$/g, "").trim();
}

/** Normalize common Supabase URL mistakes (REST path, trailing slash, etc.). */
export function normalizeSupabaseUrl(raw?: string): string | null {
  if (!raw) return null;

  let url = stripQuotes(raw);
  if (!url) return null;

  url = url.replace(/\/rest\/v1\/?$/i, "");
  url = url.replace(/\/auth\/v1\/?$/i, "");
  url = url.replace(/\/+$/, "");

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }
    if (parsed.pathname && parsed.pathname !== "/") {
      return null;
    }
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return null;
  }
}

export function normalizeSupabaseKey(raw?: string): string | null {
  if (!raw) return null;
  const key = stripQuotes(raw);
  if (!key || key.includes("your-anon") || key.length < 20) return null;
  return key;
}

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = normalizeSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!url || !key) return null;
  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}

export function getSupabaseConfigError(): string | null {
  const missing: string[] = [];

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  if (missing.length > 0) {
    return `Missing: ${missing.join(", ")}. Add them in Vercel → Settings → Environment Variables, then redeploy.`;
  }

  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  if (!url) {
    return "NEXT_PUBLIC_SUPABASE_URL must be your project URL only (https://yourproject.supabase.co) — do not include /rest/v1 or a trailing slash.";
  }

  const key = normalizeSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!key) {
    return "NEXT_PUBLIC_SUPABASE_ANON_KEY looks invalid. Copy the anon public key from Supabase → Project Settings → API.";
  }

  return null;
}
