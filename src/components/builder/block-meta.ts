// Names, icons and one-line descriptions for every block type. Kept apart from
// the (client-only) block editors so server pages like /pricing can use them.
import {
  AtSign,
  ChartColumn,
  CircleHelp,
  Clock,
  Contact,
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
  hero: { label: "כותרת", icon: UserRound, description: "שם, תמונה ופתיח", group: "Essentials" },
  links: { label: "קישורים", icon: Link2, description: "כפתורים, אריחים או כרטיסים", group: "Essentials" },
  text: { label: "טקסט", icon: Type, description: "כותרת ופסקה", group: "Essentials" },
  socials: { label: "רשתות חברתיות", icon: AtSign, description: "כל הפרופילים בשורה אחת", group: "Essentials" },
  image: { label: "תמונה", icon: ImageIcon, description: "תמונה אחת", group: "Essentials" },
  gallery: { label: "גלריה", icon: Images, description: "רשת, פסיפס או מצגת", group: "Essentials" },
  video: { label: "וידאו", icon: CirclePlay, description: "YouTube או Vimeo", group: "Essentials" },
  features: { label: "שירותים", icon: LayoutGrid, description: "שירותים או יתרונות בכרטיסים", group: "Sections" },
  testimonials: { label: "המלצות", icon: Quote, description: "ביקורות עם כוכבים", group: "Sections" },
  stats: { label: "מספרים", icon: ChartColumn, description: "מספרים שסופרים למעלה", group: "Sections" },
  pricing: { label: "מחירון", icon: Tag, description: "חבילות ומחירים", group: "Sections" },
  form: { label: "טופס", icon: Mail, description: "ניוזלטר או יצירת קשר", group: "Sections" },
  faq: { label: "שאלות ותשובות", icon: CircleHelp, description: "שאלות נפוצות", group: "Sections" },
  hours: { label: "שעות פתיחה", icon: Clock, description: "מראה למבקרים אם פתוח עכשיו", group: "Sections" },
  contact: { label: "כרטיס ביקור", icon: Contact, description: "שמירת איש קשר לטלפון בלחיצה", group: "Essentials" },
  map: { label: "מפה", icon: MapPin, description: "מיקום עם Maps ו־Waze", group: "Sections" },
  marquee: { label: "טקסט רץ", icon: MoveHorizontal, description: "פס טקסט נע", group: "Flair" },
  divider: { label: "מפריד", icon: Minus, description: "קו הפרדה מעוצב", group: "Flair" },
  spacer: { label: "רווח", icon: SeparatorHorizontal, description: "מרווח נשימה", group: "Flair" },
  countdown: { label: "ספירה לאחור", icon: Timer, description: "ספירה לאחור להשקה", group: "Flair" },
  music: { label: "מוזיקה", icon: Music, description: "Spotify, SoundCloud, Apple", group: "Flair" },
  embed: { label: "הטמעה", icon: Code, description: "כל עמוד https או וידג׳ט", group: "Flair" },
};

