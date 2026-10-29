import { cache } from "react";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, MAX_AGE, SHORT_AGE } from "@/lib/session-cookie";

export { SESSION_COOKIE, MAX_AGE };

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me",
);

export type SessionUser = {
  id: string;
  email: string;
  username: string;
  name: string | null;
  role: string;
  plan?: string;
};

/** Fingerprint of the password hash: changing the password ends every other session. */
export function passwordVersion(hash: string | null): string {
  return createHash("sha256").update(hash ?? "none").digest("base64url").slice(0, 12);
}

/** Sign a session JWT. */
async function signSession(user: SessionUser & { pv: string }): Promise<string> {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("90d")
    .sign(secret);
}

export async function createSession(user: SessionUser, remember = true) {
  const row = await prisma.user.findUnique({ where: { id: user.id }, select: { passwordHash: true } });
  const token = await signSession({ ...user, pv: passwordVersion(row?.passwordHash ?? null) });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: remember ? MAX_AGE : SHORT_AGE,
  });
}

/**
 * The signed-in user, re-checked against the database once per request: a
 * suspended or deleted account, or a changed password, ends the session at
 * once, and name/role/plan are always current (the JWT only proves identity).
 */
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  let claim: { id?: string; pv?: string } | undefined;
  try {
    const { payload } = await jwtVerify(token, secret);
    claim = payload.user as { id?: string; pv?: string } | undefined;
  } catch {
    return null;
  }
  if (!claim?.id) return null;
  const row = await prisma.user.findUnique({
    where: { id: claim.id },
    select: { id: true, email: true, username: true, name: true, role: true, plan: true, status: true, passwordHash: true },
  });
  if (!row || row.status !== "ACTIVE") return null;
  // Sessions minted before this check existed carry no pv — accept those once
  // they match an account; every new login carries one.
  if (claim.pv && claim.pv !== passwordVersion(row.passwordHash)) return null;
  return { id: row.id, email: row.email, username: row.username, name: row.name, role: row.role, plan: row.plan };
});

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
