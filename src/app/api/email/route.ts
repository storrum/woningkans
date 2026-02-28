import { NextRequest, NextResponse } from "next/server";
import type { EmailCaptureContext } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      email:         string;
      assessmentId?: string;
      sessionId?:    string;
      context:       EmailCaptureContext;
      consent:       boolean;
    };

    if (!body.email || !body.consent) {
      return NextResponse.json(
        { error: "Email en consent zijn verplicht" },
        { status: 400 }
      );
    }

    // Valideer email formaat
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Ongeldig e-mailadres" },
        { status: 400 }
      );
    }

    // Probeer Supabase — als DB niet beschikbaar is, toch succesvol antwoorden
    let userId: string | null = null;

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

      // Alleen proberen als keys écht zijn ingesteld (niet de placeholder waarden)
      if (
        supabaseUrl && serviceKey &&
        !supabaseUrl.includes("jouwprojectid") &&
        serviceKey !== "jouw-service-role-key"
      ) {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, serviceKey);

        const { data: user, error: userError } = await supabase
          .from("users")
          .upsert(
            { email: body.email, consent: body.consent },
            { onConflict: "email", ignoreDuplicates: false }
          )
          .select("id")
          .single();

        if (!userError && user) {
          userId = user.id as string;

          if (body.assessmentId) {
            await supabase
              .from("assessments")
              .update({ user_id: userId })
              .eq("id", body.assessmentId);
          }

          await supabase.from("events").insert({
            session_id: body.sessionId ?? "unknown",
            event_type: "email_submitted",
            metadata:   { context: body.context, assessmentId: body.assessmentId },
          });
        } else if (userError) {
          console.error("Email upsert error:", userError.message);
        }
      }
    } catch (dbError) {
      // DB niet beschikbaar — stil falen, gebruiker krijgt toch success
      console.error("DB unavailable for email capture:", dbError);
    }

    // Altijd succesvol antwoorden zodat UX niet breekt
    return NextResponse.json(
      { userId: userId ?? "local", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Email capture error:", error);
    return NextResponse.json({ error: "Interne serverfout" }, { status: 500 });
  }
}
