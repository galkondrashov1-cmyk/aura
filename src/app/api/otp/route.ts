import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/utils";

// POST /api/otp {phone} — DEMO MODE: instead of sending a real SMS, the code
// is returned in the response and shown on screen. A real SMS provider
// (Twilio / 019 / InforU) replaces the `demoCode` return when we go live.
export async function POST(req: Request) {
  try {
    const { phone: raw } = await req.json();
    const phone = normalizePhone(String(raw ?? ""));
    if (!phone) {
      return NextResponse.json({ error: "מספר טלפון לא תקין (05X-XXXXXXX)" }, { status: 400 });
    }

    // Light rate limit: max 5 codes per phone per 10 minutes.
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recent = await prisma.otpCode.count({
      where: { phone, createdAt: { gte: tenMinAgo } },
    });
    if (recent >= 5) {
      return NextResponse.json({ error: "יותר מדי ניסיונות — נסו שוב בעוד כמה דקות" }, { status: 429 });
    }

    const code = String(Math.floor(1000 + Math.random() * 9000));
    await prisma.otpCode.create({
      data: { phone, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    });

    return NextResponse.json({ sent: true, demoCode: code });
  } catch {
    return NextResponse.json({ error: "שגיאה — נסו שוב" }, { status: 400 });
  }
}
