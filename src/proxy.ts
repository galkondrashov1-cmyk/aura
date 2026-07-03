import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { SESSION_COOKIE, MAX_AGE } from "@/lib/session";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me",
);

// Re-sign the session once a day so the cookie keeps rolling forward: as long
// as you visit at least once every 90 days you stay logged in forever.
const REFRESH_AFTER = 60 * 60 * 24; // seconds

// Optimistic route guard (Next.js 16 renamed Middleware -> Proxy).
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── CANONICAL HOST ────────────────────────────────────────────────────
  // Force the apex (non-www) host. The session + gate cookies are host-only,
  // so without this a hop between www.useaura.me and useaura.me silently drops
  // them — which logs the user out mid-session. Redirect www → apex once.
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.slice(4);
    return NextResponse.redirect(url, 308);
  }

  // ─── TEMPORARY SITE GATE ───────────────────────────────────────────────
  // Whole-site access code. Active only when the SITE_GATE_CODE env var is set.
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

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isProtected = /^\/(dashboard|builder|admin)(\/|$)/.test(pathname);

  // Real auth check still happens server-side in the dashboard layout.
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ─── SLIDING SESSION REFRESH ───────────────────────────────────────────
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      const age = Math.floor(Date.now() / 1000) - (payload.iat ?? 0);
      if (age > REFRESH_AFTER && payload.user) {
        const fresh = await new SignJWT({ user: payload.user })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime("90d")
          .sign(secret);
        const res = NextResponse.next();
        res.cookies.set(SESSION_COOKIE, fresh, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: MAX_AGE,
        });
        return res;
      }
    } catch {
      // Expired/invalid token: clear it; guarded routes bounce to login.
      if (isProtected) {
        const res = NextResponse.redirect(new URL("/login", request.url));
        res.cookies.delete(SESSION_COOKIE);
        return res;
      }
    }
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
