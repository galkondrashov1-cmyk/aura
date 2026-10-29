import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { passwordVersion } from "@/lib/session";
import { SITE_URL } from "@/lib/site";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me");

/**
 * One-hour password-reset link. It carries a fingerprint of the current
 * password hash, so it stops working the moment the password changes — which
 * makes it single-use without storing anything.
 */
export async function resetLink(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
  if (!user) return null;
  const token = await new SignJWT({ purpose: "reset", pv: passwordVersion(user.passwordHash) })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
  return `${SITE_URL}/reset?token=${token}`;
}

/** The user a reset token is valid for, or null (expired, used, forged). */
export async function verifyReset(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.purpose !== "reset" || !payload.sub) return null;
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, username: true, name: true, role: true, plan: true, status: true, passwordHash: true },
    });
    if (!user || user.status !== "ACTIVE" || payload.pv !== passwordVersion(user.passwordHash)) return null;
    return user;
  } catch {
    return null;
  }
}
