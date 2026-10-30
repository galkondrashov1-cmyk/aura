// Single source of truth for social platforms: official brand logos, labels,
// editor options, and URL normalization. Used by both the public renderer and
// the builder editor so the two never drift.
//
// Brand glyphs come from the `simple-icons` data package (official, monochrome,
// rendered with `fill="currentColor"` so they inherit the page's icon color and
// pick up the idle/hover effects). website / email / phone are not brands, so
// they fall back to lucide line icons.
import {
  siInstagram,
  siYoutube,
  siTiktok,
  siX,
  siFacebook,
  siGithub,
  siTwitch,
  siDiscord,
  siTelegram,
  siWhatsapp,
  siSnapchat,
  siPinterest,
  siReddit,
  siSpotify,
  siSoundcloud,
  siThreads,
  siBluesky,
  siMastodon,
  siMedium,
  siSubstack,
  siPatreon,
  siBehance,
  siDribbble,
  siVimeo,
  siPaypal,
  siWaze,
  siGooglemaps,
  siCalendly,
  siApplemusic,
  siApplepodcasts,
  siYoutubemusic,
  siDeezer,
  siBandcamp,
  siKick,
  siSignal,
  siMessenger,
  siKofi,
  siBuymeacoffee,
  siEtsy,
  siFiverr,
  siUpwork,
  siFigma,
  siGitlab,
  siTumblr,
  siGoodreads,
  siLetterboxd,
  siStrava,
} from "simple-icons";
import { Globe, HandCoins, Mail, Phone, Wallet } from "lucide-react";
import type { SocialPlatform } from "@/lib/blocks";

// LinkedIn was removed from simple-icons over trademark concerns, so we keep its
// well-known 24x24 glyph inline.
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

const BRAND_PATH: Partial<Record<SocialPlatform, string>> = {
  instagram: siInstagram.path,
  youtube: siYoutube.path,
  tiktok: siTiktok.path,
  x: siX.path,
  facebook: siFacebook.path,
  linkedin: LINKEDIN_PATH,
  github: siGithub.path,
  twitch: siTwitch.path,
  discord: siDiscord.path,
  telegram: siTelegram.path,
  whatsapp: siWhatsapp.path,
  snapchat: siSnapchat.path,
  pinterest: siPinterest.path,
  reddit: siReddit.path,
  spotify: siSpotify.path,
  soundcloud: siSoundcloud.path,
  threads: siThreads.path,
  bluesky: siBluesky.path,
  mastodon: siMastodon.path,
  medium: siMedium.path,
  substack: siSubstack.path,
  patreon: siPatreon.path,
  behance: siBehance.path,
  dribbble: siDribbble.path,
  vimeo: siVimeo.path,
  paypal: siPaypal.path,
  waze: siWaze.path,
  googlemaps: siGooglemaps.path,
  calendly: siCalendly.path,
  applemusic: siApplemusic.path,
  applepodcasts: siApplepodcasts.path,
  youtubemusic: siYoutubemusic.path,
  deezer: siDeezer.path,
  bandcamp: siBandcamp.path,
  kick: siKick.path,
  signal: siSignal.path,
  messenger: siMessenger.path,
  kofi: siKofi.path,
  buymeacoffee: siBuymeacoffee.path,
  etsy: siEtsy.path,
  fiverr: siFiverr.path,
  upwork: siUpwork.path,
  figma: siFigma.path,
  gitlab: siGitlab.path,
  tumblr: siTumblr.path,
  goodreads: siGoodreads.path,
  letterboxd: siLetterboxd.path,
  strava: siStrava.path,
};

// Human labels + ordering for the editor's platform picker.
export const SOCIAL_OPTIONS: { value: SocialPlatform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "x", label: "X" },
  { value: "threads", label: "Threads" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
  { value: "discord", label: "Discord" },
  { value: "snapchat", label: "Snapchat" },
  { value: "pinterest", label: "Pinterest" },
  { value: "reddit", label: "Reddit" },
  { value: "twitch", label: "Twitch" },
  { value: "github", label: "GitHub" },
  { value: "spotify", label: "Spotify" },
  { value: "soundcloud", label: "SoundCloud" },
  { value: "vimeo", label: "Vimeo" },
  { value: "bluesky", label: "Bluesky" },
  { value: "mastodon", label: "Mastodon" },
  { value: "medium", label: "Medium" },
  { value: "substack", label: "Substack" },
  { value: "patreon", label: "Patreon" },
  { value: "behance", label: "Behance" },
  { value: "dribbble", label: "Dribbble" },
  { value: "bit", label: "Bit" },
  { value: "paybox", label: "PayBox" },
  { value: "paypal", label: "PayPal" },
  { value: "waze", label: "Waze" },
  { value: "googlemaps", label: "Google Maps" },
  { value: "calendly", label: "Calendly" },
  { value: "applemusic", label: "Apple Music" },
  { value: "applepodcasts", label: "Apple Podcasts" },
  { value: "youtubemusic", label: "YouTube Music" },
  { value: "deezer", label: "Deezer" },
  { value: "bandcamp", label: "Bandcamp" },
  { value: "kick", label: "Kick" },
  { value: "signal", label: "Signal" },
  { value: "messenger", label: "Messenger" },
  { value: "kofi", label: "Ko-fi" },
  { value: "buymeacoffee", label: "Buy Me a Coffee" },
  { value: "etsy", label: "Etsy" },
  { value: "fiverr", label: "Fiverr" },
  { value: "upwork", label: "Upwork" },
  { value: "figma", label: "Figma" },
  { value: "gitlab", label: "GitLab" },
  { value: "tumblr", label: "Tumblr" },
  { value: "goodreads", label: "Goodreads" },
  { value: "letterboxd", label: "Letterboxd" },
  { value: "strava", label: "Strava" },
  { value: "website", label: "אתר" },
  { value: "email", label: "מייל" },
  { value: "phone", label: "טלפון" },
];

export function SocialIcon({
  platform,
  className,
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  if (platform === "website") return <Globe className={className} aria-hidden="true" />;
  if (platform === "email") return <Mail className={className} aria-hidden="true" />;
  if (platform === "phone") return <Phone className={className} aria-hidden="true" />;
  // Israeli payment apps have no open glyph: neutral icons, brand colors.
  if (platform === "bit") return <Wallet className={className} aria-hidden="true" />;
  if (platform === "paybox") return <HandCoins className={className} aria-hidden="true" />;
  const path = BRAND_PATH[platform];
  if (!path) return <Globe className={className} aria-hidden="true" />;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      role="img"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

// Turn the raw value a creator typed into a usable href. Email/phone get the
// right scheme; bare domains get https://. http(s) links pass through untouched
// so the renderer can still wrap them in click tracking.
export function normalizeSocialUrl(platform: SocialPlatform, raw: string): string {
  const v = (raw ?? "").trim();
  if (!v) return "#";
  if (platform === "email") return v.startsWith("mailto:") ? v : `mailto:${v}`;
  if (platform === "phone") return v.startsWith("tel:") ? v : `tel:${v.replace(/\s+/g, "")}`;
  if (/^(https?:|mailto:|tel:)/i.test(v)) return v;
  return `https://${v}`;
}

// Official brand colors (for the "brand" icon style).
const BRAND_HEX: Partial<Record<SocialPlatform, string>> = {
  instagram: `#${siInstagram.hex}`,
  youtube: `#${siYoutube.hex}`,
  tiktok: "#111111",
  x: "#111111",
  facebook: `#${siFacebook.hex}`,
  linkedin: "#0A66C2",
  github: "#181717",
  twitch: `#${siTwitch.hex}`,
  discord: `#${siDiscord.hex}`,
  telegram: `#${siTelegram.hex}`,
  whatsapp: `#${siWhatsapp.hex}`,
  snapchat: "#F7D600",
  pinterest: `#${siPinterest.hex}`,
  reddit: `#${siReddit.hex}`,
  spotify: `#${siSpotify.hex}`,
  soundcloud: `#${siSoundcloud.hex}`,
  threads: "#111111",
  bluesky: `#${siBluesky.hex}`,
  mastodon: `#${siMastodon.hex}`,
  medium: "#111111",
  substack: `#${siSubstack.hex}`,
  patreon: "#F96854",
  behance: `#${siBehance.hex}`,
  dribbble: `#${siDribbble.hex}`,
  vimeo: `#${siVimeo.hex}`,
  bit: "#1ebba7",
  paybox: "#0b5cff",
  paypal: `#${siPaypal.hex}`,
  waze: `#${siWaze.hex}`,
  googlemaps: `#${siGooglemaps.hex}`,
  calendly: `#${siCalendly.hex}`,
  applemusic: `#${siApplemusic.hex}`,
  applepodcasts: `#${siApplepodcasts.hex}`,
  youtubemusic: `#${siYoutubemusic.hex}`,
  deezer: `#${siDeezer.hex}`,
  bandcamp: `#${siBandcamp.hex}`,
  kick: `#${siKick.hex}`,
  signal: `#${siSignal.hex}`,
  messenger: `#${siMessenger.hex}`,
  kofi: `#${siKofi.hex}`,
  buymeacoffee: "#111111",
  etsy: `#${siEtsy.hex}`,
  fiverr: `#${siFiverr.hex}`,
  upwork: `#${siUpwork.hex}`,
  figma: "#111111",
  gitlab: `#${siGitlab.hex}`,
  tumblr: `#${siTumblr.hex}`,
  goodreads: `#${siGoodreads.hex}`,
  letterboxd: `#${siLetterboxd.hex}`,
  strava: `#${siStrava.hex}`,
};

export function brandColor(platform: SocialPlatform): string {
  return BRAND_HEX[platform] ?? "#3f4654";
}

const HOSTS: [RegExp, SocialPlatform][] = [
  [/(^|\.)bitpay\.co\.il$/, "bit"],
  [/(^|\.)payboxapp\.(com|page\.link)$/, "paybox"],
  [/(^|\.)paypal\.(com|me)$/, "paypal"],
  [/(^|\.)waze\.com$/, "waze"],
  [/^maps\.google\.[a-z.]+$|^maps\.app\.goo\.gl$/, "googlemaps"],
  [/(^|\.)calendly\.com$/, "calendly"],
  [/^music\.apple\.com$/, "applemusic"],
  [/^podcasts\.apple\.com$/, "applepodcasts"],
  [/^music\.youtube\.com$/, "youtubemusic"],
  [/(^|\.)deezer\.com$/, "deezer"],
  [/(^|\.)bandcamp\.com$/, "bandcamp"],
  [/(^|\.)kick\.com$/, "kick"],
  [/(^|\.)signal\.(me|group)$/, "signal"],
  [/(^|\.)m\.me$|(^|\.)messenger\.com$/, "messenger"],
  [/(^|\.)ko-fi\.com$/, "kofi"],
  [/(^|\.)buymeacoffee\.com$/, "buymeacoffee"],
  [/(^|\.)etsy\.com$/, "etsy"],
  [/(^|\.)fiverr\.com$/, "fiverr"],
  [/(^|\.)upwork\.com$/, "upwork"],
  [/(^|\.)figma\.com$/, "figma"],
  [/(^|\.)gitlab\.com$/, "gitlab"],
  [/(^|\.)tumblr\.com$/, "tumblr"],
  [/(^|\.)goodreads\.com$/, "goodreads"],
  [/(^|\.)letterboxd\.com$/, "letterboxd"],
  [/(^|\.)strava\.com$/, "strava"],
  [/(^|\.)instagram\.com$|(^|\.)instagr\.am$/, "instagram"],
  [/(^|\.)youtube\.com$|(^|\.)youtu\.be$/, "youtube"],
  [/(^|\.)tiktok\.com$/, "tiktok"],
  [/(^|\.)x\.com$|(^|\.)twitter\.com$/, "x"],
  [/(^|\.)facebook\.com$|(^|\.)fb\.me$|(^|\.)fb\.com$/, "facebook"],
  [/(^|\.)linkedin\.com$/, "linkedin"],
  [/(^|\.)github\.com$/, "github"],
  [/(^|\.)twitch\.tv$/, "twitch"],
  [/(^|\.)discord\.(gg|com)$/, "discord"],
  [/(^|\.)t\.me$|(^|\.)telegram\.(me|org)$/, "telegram"],
  [/(^|\.)wa\.me$|(^|\.)whatsapp\.com$/, "whatsapp"],
  [/(^|\.)snapchat\.com$/, "snapchat"],
  [/(^|\.)pinterest\.[a-z.]+$|(^|\.)pin\.it$/, "pinterest"],
  [/(^|\.)reddit\.com$/, "reddit"],
  [/(^|\.)spotify\.com$/, "spotify"],
  [/(^|\.)soundcloud\.com$/, "soundcloud"],
  [/(^|\.)threads\.(net|com)$/, "threads"],
  [/(^|\.)bsky\.app$/, "bluesky"],
  [/(^|\.)medium\.com$/, "medium"],
  [/(^|\.)substack\.com$/, "substack"],
  [/(^|\.)patreon\.com$/, "patreon"],
  [/(^|\.)behance\.net$/, "behance"],
  [/(^|\.)dribbble\.com$/, "dribbble"],
  [/(^|\.)vimeo\.com$/, "vimeo"],
];

/** Best-guess platform for any link (drives automatic link icons). */
export function platformFromUrl(raw: string): SocialPlatform {
  const v = (raw ?? "").trim();
  if (/^mailto:/i.test(v) || /^[^\s@/]+@[^\s@]+\.[^\s@]+$/.test(v)) return "email";
  if (/^tel:/i.test(v)) return "phone";
  try {
    const host = new URL(/^https?:/i.test(v) ? v : `https://${v}`).hostname.toLowerCase();
    for (const [re, p] of HOSTS) if (re.test(host)) return p;
  } catch {
    /* fall through */
  }
  return "website";
}
