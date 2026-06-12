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

export function AdminLoginForm() {
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
      email: email.trim(),
      password,
    });

    if (authError) {
      setError(
        authError.message.toLowerCase().includes("invalid")
          ? "Incorrect email or password. Please try again."
          : authError.message
      );
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  if (!supabaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory px-4 py-10">
        <div className="w-full max-w-md text-center">
          <h1 className="font-serif text-3xl text-teal mb-3">Admin Setup Required</h1>
          <p className="text-teal/70 text-sm leading-relaxed mb-6">
            {configError ??
              "Supabase environment variables are missing. Add them in Vercel, then redeploy."}
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-teal text-white text-sm font-medium hover:bg-teal-light transition-colors"
          >
            View Setup Checklist
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-teal/45 mb-2">
            EllaWrightArt
          </p>
          <h1 className="font-serif text-3xl text-teal mb-2">Admin Login</h1>
          <p className="text-teal/60 text-sm">
            Sign in to manage your artwork gallery
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-[var(--shadow-card)] border border-teal/5">
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
                autoComplete="email"
                className="input-field"
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
                autoComplete="current-password"
                className="input-field"
              />
            </div>

            {error && (
              <p
                className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3"
                role="alert"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-sm text-teal/50 hover:text-coral transition-colors">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
