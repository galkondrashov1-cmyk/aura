// Shared image configuration used identically across every place a user can add
// an image — image block, gallery, product, hero avatar and hero banner — so the
// editor controls and the rendered output stay perfectly in sync.
import { cn } from "@/lib/utils";

export type ImageSize = "sm" | "md" | "lg" | "full";
export type ImageAspect = "auto" | "square" | "landscape" | "wide" | "portrait" | "tall";
export type ImageRadius = "none" | "sm" | "md" | "lg" | "full";

export type ImageConfig = {
  size?: ImageSize;
  aspect?: ImageAspect;
  radius?: ImageRadius;
};

// Width of the image relative to its column.
const SIZE_W: Record<ImageSize, string> = {
  sm: "w-2/5",
  md: "w-3/5",
  lg: "w-4/5",
  full: "w-full",
};

// Aspect-ratio. "auto" keeps the image's natural ratio.
const ASPECT_CLASS: Record<ImageAspect, string> = {
  auto: "",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-video",
  portrait: "aspect-[3/4]",
  tall: "aspect-[9/16]",
};

// Corner radius. `overflow-hidden` on the wrapper guarantees the image is clipped
// to these corners with no bulging.
const RADIUS_CLASS: Record<ImageRadius, string> = {
  none: "rounded-none",
  sm: "rounded-lg",
  md: "rounded-2xl",
  lg: "rounded-3xl",
  full: "rounded-full",
};

export const SIZE_OPTS: { id: ImageSize; label: string }[] = [
  { id: "sm", label: "S" },
  { id: "md", label: "M" },
  { id: "lg", label: "L" },
  { id: "full", label: "Full" },
];
export const ASPECT_OPTS: { id: ImageAspect; label: string }[] = [
  { id: "auto", label: "Auto" },
  { id: "square", label: "1:1" },
  { id: "landscape", label: "4:3" },
  { id: "wide", label: "16:9" },
  { id: "portrait", label: "3:4" },
  { id: "tall", label: "9:16" },
];
export const RADIUS_OPTS: { id: ImageRadius; label: string }[] = [
  { id: "none", label: "None" },
  { id: "sm", label: "S" },
  { id: "md", label: "M" },
  { id: "lg", label: "L" },
  { id: "full", label: "Round" },
];

type ResolveOpts = {
  defaultSize?: ImageSize;
  defaultAspect?: ImageAspect;
  defaultRadius?: ImageRadius;
  /** Lock the width (e.g. banner is always full-width). */
  lockWidth?: string;
};

/**
 * Resolve an ImageConfig into three class slots:
 *  - `box`   — width + radius + `overflow-hidden` (guarantees clean clipped corners)
 *  - `frame` — the aspect-ratio wrapper around the <img> (empty when "auto")
 *  - `img`   — fills the frame (object-cover) or flows naturally (auto)
 * Keeping them separate lets captions / grids sit outside the aspect frame
 * without being squished.
 */
export function resolveImage(cfg: ImageConfig | undefined, opts: ResolveOpts = {}) {
  const size = cfg?.size ?? opts.defaultSize ?? "full";
  const aspect = cfg?.aspect ?? opts.defaultAspect ?? "auto";
  const radius = cfg?.radius ?? opts.defaultRadius ?? "md";
  const aspectClass = ASPECT_CLASS[aspect] ?? "";
  return {
    box: cn(opts.lockWidth ?? SIZE_W[size], RADIUS_CLASS[radius], "overflow-hidden"),
    frame: aspectClass,
    img: aspectClass ? "h-full w-full object-cover" : "w-full",
    hasAspect: !!aspectClass,
  };
}
