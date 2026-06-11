import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createAdminClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}
