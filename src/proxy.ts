import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

// Optimistic route guard (Next.js 16 renamed Middleware -> Proxy).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── TEMPORARY SITE GATE ───────────────────────────────────────────────
  // Whole-site access code. Active only when the SITE_GATE_CODE env var is set.
  // To turn it off after testing: delete SITE_GATE_CODE in Vercel (instant, no
  // redeploy needed) — or delete this block + src/app/gate + src/app/api/gate.
  const gate = process.env.SITE_GATE_CODE;
  if (gate) {
    const open =
      pathname === "/gate" ||
      pathname.startsWith("/api/gate") ||
      request.cookies.get("aura_gate")?.value === gate;
    if (!open) {
      return NextResponse.redirect(new URL("/gate", request.url));
    }
  }
  // ─── END SITE GATE ─────────────────────────────────────────────────────

  // Real auth check still happens server-side in the dashboard layout.
  if (/^\/(dashboard|builder|admin)(\/|$)/.test(pathname)) {
    if (!request.cookies.has(SESSION_COOKIE)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
