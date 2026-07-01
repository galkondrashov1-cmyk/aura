import { createHmac, timingSafeEqual } from "node:crypto";

// Opaque, signed token for sharing a page's DRAFT preview. Not guessable: the
// pageId is HMAC-signed with AUTH_SECRET, so only links we mint are valid.
const secret = process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me";

function sig(body: string): string {
  return createHmac("sha256", secret).update(body).digest("base64url").slice(0, 24);
}

export function signDraft(pageId: string): string {
  const body = Buffer.from(pageId).toString("base64url");
  return `${body}.${sig(body)}`;
}

export function verifyDraft(token: string): string | null {
  const [body, s] = token.split(".");
  if (!body || !s) return null;
  const expected = sig(body);
  if (s.length !== expected.length) return null;
  try {
    if (!timingSafeEqual(Buffer.from(s), Buffer.from(expected))) return null;
    return Buffer.from(body, "base64url").toString("utf8");
  } catch {
    return null;
  }
}
