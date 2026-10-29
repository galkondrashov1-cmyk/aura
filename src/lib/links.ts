// Isomorphic outbound-link helpers (used by the renderer in both the public
// page and the client-side editor). Signing for click tracking lives in
// links-server.ts so node:crypto never reaches the browser bundle.

/**
 * Turn whatever a creator typed into a usable href: bare domains get https://,
 * phone numbers get tel:, emails get mailto:. Anything with a scheme we don't
 * allow (javascript:, data:, …) collapses to "#".
 */
export function normalizeHref(raw: string | undefined | null): string {
  const v = (raw ?? "").trim();
  if (!v || v === "https://" || v === "http://") return "#";
  if (/^(https?:|mailto:|tel:|sms:)/i.test(v)) return v;
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  if (v.startsWith("#")) return v;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return `mailto:${v}`;
  if (/^\+?[\d\s().-]{6,}$/.test(v)) return `tel:${v.replace(/[^\d+]/g, "")}`;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return "#"; // unknown / unsafe scheme
  if (/^[\w-]+(\.[\w-]+)+/.test(v)) return `https://${v}`;
  return "#";
}

/** True for links that should open in a new tab. */
export function isExternal(href: string): boolean {
  return /^https?:/i.test(href);
}

/** Precomputed raw-url → tracked-href map, built on the server. */
export type HrefMap = Record<string, string>;

export function resolveHref(raw: string | undefined | null, map?: HrefMap): string {
  const key = (raw ?? "").trim();
  return (map && map[key]) || normalizeHref(key);
}

/** Key the floating button's tracked href is stored under in an HrefMap. */
export const FAB_KEY = "\u0000fab";

/** Where the floating button goes, before tracking. */
export function fabHref(fab: { kind: string; value: string }): string {
  const v = fab.value.trim();
  if (fab.kind === "whatsapp") return `https://wa.me/${v.replace(/[^\d]/g, "")}`;
  if (fab.kind === "phone") return `tel:${v.replace(/[^\d+]/g, "")}`;
  if (fab.kind === "email") return `mailto:${v}`;
  return normalizeHref(v);
}
