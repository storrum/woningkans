import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, eventName, props } = await req.json();
    const supabase = await createClient();
    await supabase.from("events").insert({ session_id: sessionId, event_name: eventName, props });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
