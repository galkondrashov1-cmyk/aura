/** Coarse device classification from a User-Agent string. */
export function deviceFromUA(ua: string | null): "desktop" | "mobile" | "tablet" {
  if (!ua) return "desktop";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobile|iphone|android/i.test(ua)) return "mobile";
  return "desktop";
}

/** Only allow safe outbound protocols for click redirects. */
export function safeUrl(url: string | null): string | null {
  if (!url) return null;
  return /^(https?:|mailto:)/i.test(url) ? url : null;
}
