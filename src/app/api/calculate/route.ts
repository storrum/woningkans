import { NextRequest, NextResponse } from "next/server";
import { calculateScore } from "@/lib/scoreEngine";
import { userProfileSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const profile = userProfileSchema.parse(await req.json());
    const result = calculateScore(profile);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
