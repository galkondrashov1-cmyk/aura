import { cookies } from "next/headers";

// Second factor on top of the role check: the admin panel also requires a
// short code. Configurable via ADMIN_PANEL_CODE; defaults to 5246.
export const ADMIN_COOKIE = "aura_admin";

export function adminCode(): string {
  return process.env.ADMIN_PANEL_CODE || "5246";
}

/** True when the current request carries a valid admin-unlock cookie. */
export async function isAdminUnlocked(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === adminCode();
}
