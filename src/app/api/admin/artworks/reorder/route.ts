import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { supabase } = await requireAuth();
    const { items } = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    for (const item of items) {
      const { error } = await supabase
        .from("artworks")
        .update({ display_order: item.display_order })
        .eq("id", item.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : 500 }
    );
  }
}
