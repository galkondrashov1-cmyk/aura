// Typewriter options for the header's rotating words. Shared by the renderer,
// the editor and plan fitting.
import type { Plan } from "@/lib/plans";

export type TypeFxId = "type" | "erase" | "scramble" | "fade" | "slide" | "blur" | "flip" | "wave" | "marker";

export type Typing = {
  fx?: TypeFxId;
  speed?: "slow" | "normal" | "fast";
  cursor?: "bar" | "block" | "under" | "none";
  color?: "accent" | "gradient" | "text";
  /** false = stop on the last word. */
  loop?: boolean;
};

export const TYPE_FX: { id: TypeFxId; name: string; tier: Plan }[] = [
  { id: "type", name: "הקלדה", tier: "FREE" },
  { id: "erase", name: "סימון ומחיקה", tier: "FREE" },
  { id: "fade", name: "דהייה", tier: "FREE" },
  { id: "scramble", name: "פענוח", tier: "PLUS" },
  { id: "slide", name: "החלקה", tier: "PLUS" },
  { id: "blur", name: "פוקוס", tier: "PLUS" },
  { id: "flip", name: "היפוך", tier: "PLUS" },
  { id: "wave", name: "גל אותיות", tier: "PLUS" },
  { id: "marker", name: "מרקר", tier: "PLUS" },
];

export const TYPE_CURSORS = [
  { id: "bar", label: "קו" },
  { id: "block", label: "בלוק" },
  { id: "under", label: "קו תחתון" },
  { id: "none", label: "ללא" },
] as const;

export const TYPE_COLORS = [
  { id: "accent", label: "מבטא" },
  { id: "gradient", label: "גרדיאנט" },
  { id: "text", label: "טקסט" },
] as const;

export const TYPE_SPEEDS = [
  { id: "slow", label: "איטי" },
  { id: "normal", label: "רגיל" },
  { id: "fast", label: "מהיר" },
] as const;
