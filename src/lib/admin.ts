import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const ADMIN_GATE_COOKIE = "hila_admin_gate";

/** The admin panel access code. Override with ADMIN_CODE in production. */
export function adminCode(): string {
  return process.env.ADMIN_CODE || "5246";
}

export type AdminCheck =
  | { ok: true; adminId: string }
  | { ok: false; reason: "no-session" | "not-admin" | "no-gate" };

/**
 * Full admin check: valid session + ADMIN role (verified against the DB,
 * never trusted from the cookie) + the admin gate cookie (access code).
 */
export async function checkAdmin(): Promise<AdminCheck> {
  const session = await getSession();
  if (!session) return { ok: false, reason: "no-session" };

  const biz = await prisma.business.findUnique({
    where: { id: session.id },
    select: { id: true, role: true },
  });
  if (biz?.role !== "ADMIN") return { ok: false, reason: "not-admin" };

  const jar = await cookies();
  if (jar.get(ADMIN_GATE_COOKIE)?.value !== adminCode()) {
    return { ok: false, reason: "no-gate" };
  }
  return { ok: true, adminId: biz.id };
}

/** For server actions: throws unless the caller is a gated admin. */
export async function requireAdmin(): Promise<string> {
  const check = await checkAdmin();
  if (!check.ok) throw new Error("Unauthorized");
  return check.adminId;
}
