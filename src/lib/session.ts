import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "hila_session";
export const MAX_AGE = 60 * 60 * 24 * 90; // 90 days

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me",
);

export type SessionBusiness = {
  id: string;
  email: string;
  slug: string;
  name: string;
  ownerName: string;
  plan: string;
};

export async function signSession(biz: SessionBusiness): Promise<string> {
  return new SignJWT({ biz })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("90d")
    .sign(secret);
}

export async function createSession(biz: SessionBusiness) {
  const token = await signSession(biz);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSession(): Promise<SessionBusiness | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return (payload.biz as SessionBusiness) ?? null;
  } catch {
    return null;
  }
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
