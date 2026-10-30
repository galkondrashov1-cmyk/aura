// The guided "new page" flow. One pure function turns the answers into a page,
// so the live preview in the browser and the page the server saves are the
// same thing. Only what the person typed goes on the page: no sample content
// that could be published by mistake.
import type { Block, BlockType, DayHours, LinkItem, PageContent, PageDesign, SocialPlatform } from "@/lib/blocks";
import { FULL_THEMES } from "@/lib/design";
import { platformFromUrl } from "@/lib/socials";

export type PurposeId = "business" | "services" | "creator" | "portfolio" | "music" | "personal";

export type Purpose = {
  id: PurposeId;
  name: string;
  blurb: string;
  /** Placeholder for the one-line description. */
  example: string;
  /** Quick one-liners the person can tap instead of typing. */
  taglines: string[];
  look: string;
  /** Asks for an address and opening hours. */
  local?: boolean;
  /** Blocks the editor suggests next. */
  next: BlockType[];
};

export const PURPOSES: Purpose[] = [
  {
    id: "business",
    name: "עסק מקומי",
    blurb: "בית קפה, חנות, סטודיו או קליניקה",
    example: "קפה ומאפים טריים, כל בוקר מ־7",
    taglines: ["פתוחים כל השבוע", "משלוחים באזור המרכז", "קבעו תור בוואטסאפ"],
    look: "white-city",
    local: true,
    next: ["features", "testimonials", "gallery"],
  },
  {
    id: "services",
    name: "שירותים ופגישות",
    blurb: "מאמנים, יועצים, מטפלים ומורים",
    example: "אימון אישי בבית שלכם, בלי חדר כושר",
    taglines: ["פגישת היכרות ראשונה בחינם", "זמינה לפגישות אונליין", "15 שנות ניסיון"],
    look: "dead-sea",
    next: ["pricing", "testimonials", "faq"],
  },
  {
    id: "creator",
    name: "יוצרי תוכן",
    blurb: "כל הרשתות והשיתופי פעולה במקום אחד",
    example: "סרטונים על אוכל ישראלי, פעמיים בשבוע",
    taglines: ["סרטון חדש בכל יום שישי", "לשיתופי פעולה: בהודעה", "הקישורים מהסטורי"],
    look: "jaffa-night",
    next: ["stats", "video", "form"],
  },
  {
    id: "portfolio",
    name: "פרילנס ותיק עבודות",
    blurb: "מעצבים, צלמים, מפתחים ואנשי קריאייטיב",
    example: "מעצבת גרפית, ממתגת עסקים קטנים",
    taglines: ["פנויה לפרויקטים חדשים", "זמין מינואר", "עבודות נבחרות למטה"],
    look: "rothschild",
    next: ["gallery", "testimonials", "features"],
  },
  {
    id: "music",
    name: "מוזיקה ואירועים",
    blurb: "הופעות, שירים חדשים וכרטיסים",
    example: "שירים מקוריים בעברית, הופעות בכל הארץ",
    taglines: ["סינגל חדש בחוץ", "הופעה הקרובה: בקרוב", "כרטיסים בקישור"],
    look: "rose-nebula",
    next: ["music", "countdown", "video"],
  },
  {
    id: "personal",
    name: "לינק בביו",
    blurb: "כל הקישורים שלכם, עמוד אחד",
    example: "כל מה שאני עושה, במקום אחד",
    taglines: ["היי, נעים להכיר", "כל הקישורים שלי", "דברו איתי"],
    look: "galilee",
    next: ["text", "image", "video"],
  },
];

const ISRAELI = new Set(["white-city", "jerusalem-stone", "dead-sea", "eilat-reef", "negev-dusk", "galilee", "jaffa-night", "bougainvillea", "shuk", "florentin", "rothschild"]);

/** Looks offered in the flow: the Israeli themes first, then the rest. */
export const LOOKS = [...FULL_THEMES].sort((a, b) => Number(ISRAELI.has(b.id)) - Number(ISRAELI.has(a.id)));

export type WizardLink = { url: string; label?: string };

export type WizardState = {
  purpose: PurposeId;
  name: string;
  tagline: string;
  avatar?: string;
  /** Israeli mobile or international number, digits only once cleaned. */
  whatsapp?: string;
  links: WizardLink[];
  address?: string;
  hours?: boolean;
  look: string;
};

export const MAX_LINKS = 8;

/** Profiles that read best as an icon row; everything else becomes a button. */
const ICON_PLATFORMS = new Set<SocialPlatform>([
  "instagram", "tiktok", "facebook", "youtube", "x", "threads", "linkedin", "pinterest", "snapchat",
  "twitch", "github", "behance", "dribbble", "spotify", "soundcloud", "bluesky", "telegram", "discord",
]);

/** Button text for a pasted link, before the person edits it. */
const LINK_LABEL: Partial<Record<SocialPlatform, string>> = {
  bit: "תשלום בביט",
  paybox: "תשלום בפייבוקס",
  paypal: "תשלום ב־PayPal",
  waze: "ניווט ב־Waze",
  googlemaps: "איך מגיעים",
  calendly: "קביעת פגישה",
  email: "שליחת מייל",
  phone: "התקשרו אליי",
  whatsapp: "דברו איתי בוואטסאפ",
  applemusic: "Apple Music",
  youtubemusic: "YouTube Music",
  etsy: "החנות שלי ב־Etsy",
  website: "לאתר שלי",
};

export const linkLabel = (url: string) => LINK_LABEL[platformFromUrl(url)] ?? "קישור";
export const isIconLink = (url: string) => ICON_PLATFORMS.has(platformFromUrl(url));

/** "050-123 4567" → "972501234567"; anything already international is kept. */
export function waNumber(raw?: string): string | undefined {
  const d = (raw ?? "").replace(/\D/g, "");
  if (d.length < 9) return undefined;
  return d.startsWith("0") ? `972${d.slice(1)}` : d;
}

const day = (from: string, to: string): DayHours => ({ from, to });
/** A typical Israeli week; the editor has every day to adjust. */
const STANDARD_HOURS: DayHours[] = [
  day("09:00", "18:00"), day("09:00", "18:00"), day("09:00", "18:00"), day("09:00", "18:00"), day("09:00", "18:00"),
  day("09:00", "13:00"), { closed: true },
];

export function purposeOf(id: string): Purpose {
  return PURPOSES.find((p) => p.id === id) ?? PURPOSES[PURPOSES.length - 1];
}

export function lookDesign(id: string): PageDesign {
  return (FULL_THEMES.find((t) => t.id === id) ?? FULL_THEMES[0]).design;
}

/** The page the answers describe. Stable block ids keep the preview from remounting. */
export function buildWizardPage(s: WizardState): PageContent {
  const purpose = purposeOf(s.purpose);
  const blocks: Block[] = [];
  blocks.push({
    id: "w-hero",
    type: "hero",
    name: s.name.trim() || "השם שלכם",
    tagline: s.tagline.trim(),
    avatarUrl: s.avatar || null,
    layout: "center",
  });

  const links = s.links.filter((l) => l.url.trim());
  const buttons: LinkItem[] = [];
  const wa = waNumber(s.whatsapp);
  if (wa) buttons.push({ label: "דברו איתנו בוואטסאפ", url: `https://wa.me/${wa}`, icon: "auto", highlighted: true });
  for (const l of links) if (!isIconLink(l.url)) buttons.push({ label: l.label?.trim() || linkLabel(l.url), url: l.url.trim(), icon: "auto" });
  if (s.address?.trim()) buttons.push({ label: "ניווט ב־Waze", url: `https://waze.com/ul?q=${encodeURIComponent(s.address.trim())}&navigate=yes`, icon: "auto" });
  if (buttons.length) blocks.push({ id: "w-links", type: "links", items: buttons });

  const icons = links.filter((l) => isIconLink(l.url));
  if (icons.length) {
    blocks.push({ id: "w-socials", type: "socials", iconStyle: "chip", items: icons.map((l) => ({ platform: platformFromUrl(l.url), url: l.url.trim() })) });
  }

  if (purpose.local && s.hours) blocks.push({ id: "w-hours", type: "hours", heading: "שעות פתיחה", days: STANDARD_HOURS });
  if (purpose.local && s.address?.trim()) blocks.push({ id: "w-map", type: "map", query: s.address.trim(), height: "sm" });

  return { design: { ...lookDesign(s.look), reveal: "rise" }, blocks };
}

const str = (x: unknown, max: number) => (typeof x === "string" ? x.slice(0, max) : "");
const safeUrl = (x: unknown) => {
  const v = str(x, 500).trim();
  if (!v) return "";
  const withScheme = /^(https?:|mailto:|tel:)/i.test(v) ? v : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? `mailto:${v}` : `https://${v}`;
  return /^(https?:\/\/[^\s]+|mailto:[^\s]+|tel:[+\d\s-]+)$/i.test(withScheme) ? withScheme : "";
};

/** Server-side: rebuild a trustworthy state from whatever the browser sent. */
export function cleanWizard(raw: unknown): WizardState {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const links = Array.isArray(r.links) ? r.links : [];
  return {
    purpose: purposeOf(str(r.purpose, 20)).id,
    name: str(r.name, 60).trim(),
    tagline: str(r.tagline, 120),
    avatar: /^(https:\/\/|\/api\/media\/)/.test(str(r.avatar, 500)) ? str(r.avatar, 500) : undefined,
    whatsapp: str(r.whatsapp, 20) || undefined,
    links: links
      .slice(0, MAX_LINKS)
      .map((l) => (l && typeof l === "object" ? (l as Record<string, unknown>) : {}))
      .map((l) => ({ url: safeUrl(l.url), label: str(l.label, 60) || undefined }))
      .filter((l) => l.url),
    address: str(r.address, 120) || undefined,
    hours: r.hours === true,
    look: FULL_THEMES.some((t) => t.id === r.look) ? (r.look as string) : purposeOf(str(r.purpose, 20)).look,
  };
}
