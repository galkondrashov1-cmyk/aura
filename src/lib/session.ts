import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "aura_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me",
);

export type SessionUser = {
  id: string;
  email: string;
  username: string;
  name: string | null;
  role: string;
};

export async function createSession(user: SessionUser, remember = true) {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // "Remember me" → persistent 30-day cookie. Unchecked → session cookie
    // (omit maxAge) that clears when the browser closes.
    ...(remember ? { maxAge: MAX_AGE } : {}),
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return (payload.user as SessionUser) ?? null;
  } catch {
    return null;
  }
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
