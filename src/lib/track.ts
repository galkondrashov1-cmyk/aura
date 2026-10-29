/** Coarse device classification from a User-Agent string. */
export function deviceFromUA(ua: string | null): "desktop" | "mobile" | "tablet" {
  if (!ua) return "desktop";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobile|iphone|android/i.test(ua)) return "mobile";
  return "desktop";
}

/** Crawlers and link-preview fetchers (WhatsApp, Slack…) aren't visitors. */
export function isBot(ua: string | null): boolean {
  if (!ua) return true;
  return /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|slack|embedly|headless|lighthouse|pingdom|curl|wget|python-requests|axios/i.test(
    ua,
  );
}

/** Only allow safe outbound protocols for click redirects. */
export function safeUrl(url: string | null): string | null {
  if (!url) return null;
  return /^(https?:|mailto:|tel:)/i.test(url) ? url : null;
}

/** "https://www.instagram.com/x?y" → "instagram.com" (null for same-site / junk). */
export function referrerHost(ref: unknown, ownHost?: string | null): string | null {
  if (typeof ref !== "string" || !ref) return null;
  try {
    const h = new URL(ref).hostname.replace(/^www\./, "").toLowerCase();
    if (!h || (ownHost && h === ownHost.replace(/^www\./, "").split(":")[0])) return null;
    return h.slice(0, 120);
  } catch {
    return null;
  }
}
