// The editable content of a business site (stored as JSON on Site.content).

export type SiteContent = {
  emoji: string; // small "logo" mark
  tagline: string; // one-liner under the business name
  about: string; // free paragraph
  ctaText: string; // booking button label
  phone: string;
  whatsapp: string;
  instagram: string; // handle without @
  facebook: string; // page url
  address: string;
  showServices: boolean;
  showHours: boolean;
  showAbout: boolean;
};

export const DEFAULT_CONTENT: SiteContent = {
  emoji: "✨",
  tagline: "",
  about: "",
  ctaText: "לקביעת תור",
  phone: "",
  whatsapp: "",
  instagram: "",
  facebook: "",
  address: "",
  showServices: true,
  showHours: true,
  showAbout: true,
};

export function asContent(v: unknown): SiteContent {
  const c = (v ?? {}) as Partial<SiteContent>;
  return { ...DEFAULT_CONTENT, ...c };
}
