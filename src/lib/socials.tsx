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
} from "simple-icons";
import { Globe, Mail, Phone } from "lucide-react";
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
  { value: "website", label: "Website" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
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
