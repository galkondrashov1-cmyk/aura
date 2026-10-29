import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Second factor on top of the role check: the admin panel also requires a
// short code. Configurable via ADMIN_PANEL_CODE; defaults to 5246.
export const ADMIN_COOKIE = "aura_admin";

export function adminCode(): string {
  return process.env.ADMIN_PANEL_CODE || "5246";
}

/** The cookie holds a keyed digest of the code, never the code itself. */
export function adminToken(): string {
  return createHmac("sha256", process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me")
    .update(`admin:${adminCode()}`)
    .digest("base64url");
}

/** Constant-time comparison for the entered code. */
export function codeMatches(entered: string): boolean {
  const a = Buffer.from(entered);
  const b = Buffer.from(adminCode());
  return a.length === b.length && timingSafeEqual(a, b);
}

/** True when the current request carries a valid admin-unlock cookie. */
export async function isAdminUnlocked(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === adminToken();
}
