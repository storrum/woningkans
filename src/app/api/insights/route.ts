// ============================================
// WoningKans — /api/insights route
// Returns ai-based insights for a given score
// ============================================

import { NextRequest, NextResponse } from "next/server";
import type { UserProfile } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, score }: { profile: UserProfile; score: number } = body;

    if (!profile || score === undefined) {
      return NextResponse.json({ error: "Missing profile or score" }, { status: 400 });
    }

    // Generate insights based on score
    const insights = generateInsights(profile, score);

    return NextResponse.json({ insights });
  } catch (err) {
    console.error("Insights error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function generateInsights(profile: UserProfile, score: number): string[] {
  const insights: string[] = [];

  if (score >= 70) {
    insights.push(`Je hebt een sterke outgangspositie met een WinScore van ${score}. Blijf tastbaar ijferen op de markt.`);
  } else if (score >= 40) {
    insights.push(`Jouw WinScore van ${score} is redelijk, maar er is ruimte voor verbetering.`);
  } else {
    insights.push(`Een WinScore van ${score} is laag. Focus op budget en strategie om je kansen te vergroten.`);
  }

  if (!profile.vastContract) {
    insights.push("Een vast contract verhoogt je maximale hypotheek significant.");
  }

  if (profile.eigenGeld < profile.desiredPrice * 0.06) {
    insights.push("Je eigen geld dekt de kosten koper niet volledig. Een extra buffer versterkt je positie.");
  }

  return insights;
}
