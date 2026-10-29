// Usernames that would shadow an app route (useaura.me/<name>) or confuse
// visitors. Shared by signup and the settings rename.
export const RESERVED_USERNAMES = new Set([
  "login",
  "signup",
  "logout",
  "dashboard",
  "builder",
  "admin",
  "api",
  "gate",
  "examples",
  "templates",
  "pricing",
  "forgot",
  "reset",
  "d",
  "robots",
  "sitemap",
  "manifest",
  "favicon",
  "icon",
  "settings",
  "about",
  "terms",
  "privacy",
  "help",
  "support",
  "aura",
  "useaura",
  "www",
]);

/** Page slugs: lowercase letters, numbers and dashes. */
export const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;

export function toSlug(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}
