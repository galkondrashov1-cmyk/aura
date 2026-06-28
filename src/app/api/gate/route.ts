// TEMPORARY SITE GATE — verifies the access code and sets the unlock cookie.
// Remove together with src/app/gate and the gate block in src/proxy.ts.
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const expected = process.env.SITE_GATE_CODE;
  const { code } = await req.json().catch(() => ({ code: "" }));
  if (expected && code === expected) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("aura_gate", expected, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
