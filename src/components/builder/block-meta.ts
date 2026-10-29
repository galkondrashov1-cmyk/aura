// Names, icons and one-line descriptions for every block type. Kept apart from
// the (client-only) block editors so server pages like /pricing can use them.
import {
  AtSign,
  ChartColumn,
  CircleHelp,
  CirclePlay,
  Code,
  Image as ImageIcon,
  Images,
  LayoutGrid,
  Link2,
  Mail,
  MapPin,
  Minus,
  MoveHorizontal,
  Music,
  Quote,
  SeparatorHorizontal,
  Tag,
  Timer,
  Type,
  UserRound,
} from "lucide-react";
import type { BlockType } from "@/lib/blocks";

export type BlockMeta = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  group: "Essentials" | "Sections" | "Flair";
};

export const BLOCK_META: Record<BlockType, BlockMeta> = {
  hero: { label: "Header", icon: UserRound, description: "Your name, photo & intro", group: "Essentials" },
  links: { label: "Links", icon: Link2, description: "Buttons, tiles or cards", group: "Essentials" },
  text: { label: "Text", icon: Type, description: "Heading & paragraph", group: "Essentials" },
  socials: { label: "Social icons", icon: AtSign, description: "All your profiles in a row", group: "Essentials" },
  image: { label: "Image", icon: ImageIcon, description: "A single photo", group: "Essentials" },
  gallery: { label: "Gallery", icon: Images, description: "Grid, masonry or slideshow", group: "Essentials" },
  video: { label: "Video", icon: CirclePlay, description: "YouTube or Vimeo", group: "Essentials" },
  features: { label: "Features", icon: LayoutGrid, description: "Services or perks in cards", group: "Sections" },
  testimonials: { label: "Testimonials", icon: Quote, description: "Reviews with stars", group: "Sections" },
  stats: { label: "Stats", icon: ChartColumn, description: "Numbers that count up", group: "Sections" },
  pricing: { label: "Pricing", icon: Tag, description: "Plans & packages", group: "Sections" },
  form: { label: "Form", icon: Mail, description: "Newsletter or contact", group: "Sections" },
  faq: { label: "FAQ", icon: CircleHelp, description: "Questions & answers", group: "Sections" },
  map: { label: "Map", icon: MapPin, description: "Location with Maps & Waze", group: "Sections" },
  marquee: { label: "Marquee", icon: MoveHorizontal, description: "Scrolling ticker text", group: "Flair" },
  divider: { label: "Divider", icon: Minus, description: "A styled separator", group: "Flair" },
  spacer: { label: "Spacer", icon: SeparatorHorizontal, description: "Breathing room", group: "Flair" },
  countdown: { label: "Countdown", icon: Timer, description: "Count down to a launch", group: "Flair" },
  music: { label: "Music", icon: Music, description: "Spotify, SoundCloud, Apple", group: "Flair" },
  embed: { label: "Embed", icon: Code, description: "Any https page or widget", group: "Flair" },
};

