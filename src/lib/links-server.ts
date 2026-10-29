import { createHmac, timingSafeEqual } from "node:crypto";
import type { PageContent } from "@/lib/blocks";
import { normalizeHref, type HrefMap } from "@/lib/links";
import { normalizeSocialUrl } from "@/lib/socials";
import { toPlain } from "@/lib/richtext";

// Click tracking is HMAC-signed so /api/r only ever redirects to URLs that
// really appear on a published page — never an open redirect for phishing.
const secret = process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me";

function clickSig(pageId: string, url: string): string {
  return createHmac("sha256", secret).update(`${pageId}\n${url}`).digest("base64url").slice(0, 16);
}

export function verifyClick(pageId: string, url: string, sig: string): boolean {
  const expected = clickSig(pageId, url);
  if (sig.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

function tracked(pageId: string, raw: string, label?: string): string {
  const url = normalizeHref(raw);
  if (!/^https?:/i.test(url)) return url;
  const q = new URLSearchParams({ p: pageId, u: url, s: clickSig(pageId, url) });
  if (label) q.set("l", label.slice(0, 80));
  return `/api/r?${q.toString()}`;
}

/** Every outbound link on the page → its signed, tracked href. */
export function buildHrefMap(content: PageContent, pageId: string): HrefMap {
  const map: HrefMap = {};
  const add = (raw: string | undefined, label?: string) => {
    const key = (raw ?? "").trim();
    if (key && !(key in map)) map[key] = tracked(pageId, key, label);
  };
  for (const b of content.blocks) {
    switch (b.type) {
      case "links":
        b.items.forEach((l) => add(l.url, toPlain(l.label)));
        break;
      case "socials":
        b.items.forEach((s) => {
          const href = normalizeSocialUrl(s.platform, s.url);
          if (/^https?:/i.test(href)) map[s.url.trim()] = tracked(pageId, href, s.platform);
        });
        break;
      case "pricing":
        b.items.forEach((p) => add(p.url, p.name));
        break;
      case "video":
        add(b.url, "Video");
        break;
    }
  }
  const fab = content.design?.fab;
  if (fab?.kind === "link") add(fab.value, fab.label || "Floating button");
  return map;
}
