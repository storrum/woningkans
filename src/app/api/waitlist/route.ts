import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { z } from "zod";

const Schema = z.object({ email: z.email() });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = Schema.parse(body);

    const supabase = await createClient();
    const { error } = await supabase
      .from("waitlist")
      .upsert({ email }, { onConflict: "email" });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
