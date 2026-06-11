import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./env";

export { isSupabaseConfigured, getSupabaseConfigError } from "./env";

/** Cookie-less client for public artwork reads (safe in generateStaticParams). */
export function createPublicClient() {
  const env = getSupabaseEnv();
  if (!env) return null;

  return createSupabaseClient(env.url, env.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Cookie-based client for authenticated admin routes. */
export async function createClient() {
  const env = getSupabaseEnv();
  if (!env) return null;

  const cookieStore = await cookies();

  return createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component — ignore
        }
      },
    },
  });
}
