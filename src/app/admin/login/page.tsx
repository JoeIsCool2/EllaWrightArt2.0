"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createClient,
  getSupabaseConfigError,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const configError = getSupabaseConfigError();
  const supabaseReady = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    if (!supabase) {
      setError(configError ?? "Supabase is not configured.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4 py-10">
      <div className="w-full max-w-md">
        {!supabaseReady && configError && (
          <div className="mb-6 bg-white rounded-2xl p-5 shadow-[var(--shadow-soft)] border border-coral/20">
            <p className="text-sm font-medium text-teal mb-2">Setup required</p>
            <p className="text-sm text-teal/70 leading-relaxed">{configError}</p>
            <Link
              href="/admin"
              className="inline-block mt-3 text-sm text-coral hover:underline"
            >
              View full setup checklist →
            </Link>
          </div>
        )}

        <div className="bg-white rounded-2xl p-8 shadow-[var(--shadow-card)]">
          <h1 className="font-serif text-3xl text-teal text-center mb-2">
            Admin Login
          </h1>
          <p className="text-teal/60 text-center text-sm mb-8">
            Sign in to manage artwork
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-teal mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                disabled={!supabaseReady}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-teal mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
                disabled={!supabaseReady}
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading || !supabaseReady}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
