import { PageRenderer } from "@/components/renderer/page-renderer";
import type { PageContent } from "@/lib/blocks";
import { cn } from "@/lib/utils";

const PAGE_W = 390;
const BEZEL = 6;

/** A real page, drawn by the same renderer as a live one, inside a phone. */
export function Phone({ content, width = 280, height = 568, className }: { content: PageContent; width?: number; height?: number; className?: string }) {
  const scale = (width - BEZEL * 2) / PAGE_W;
  return (
    <div
      inert
      className={cn("shrink-0 overflow-hidden rounded-[34px] border-[#2e2b28] bg-black", className)}
      style={{ width, height, borderWidth: BEZEL }}
    >
      <div data-mode="vivid" dir="ltr" className="h-full w-full overflow-hidden">
        <div
          className="pointer-events-none flex origin-top-left flex-col select-none *:flex-1"
          style={{ width: PAGE_W, minHeight: (height - BEZEL * 2) / scale, transform: `scale(${scale})` }}
        >
          <PageRenderer content={content} embedded thumbnail hideBadge />
        </div>
      </div>
    </div>
  );
}

/** One block on a real page background, at full size. */
export function BlockDemo({ content, className }: { content: PageContent; className?: string }) {
  return (
    <div inert data-mode="vivid" className={cn("overflow-hidden rounded-xl border border-border", className)}>
      <PageRenderer content={content} embedded thumbnail hideBadge />
    </div>
  );
}
