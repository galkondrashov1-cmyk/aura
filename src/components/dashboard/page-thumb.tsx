import { PageRenderer } from "@/components/renderer/page-renderer";
import type { PageContent } from "@/lib/blocks";
import { cn } from "@/lib/utils";

// Third-party players and maps would load a full iframe per card for a
// 240px-tall preview; the top of the page is what identifies it anyway.
const HEAVY = new Set(["embed", "music", "map", "video"]);
const VISIBLE_BLOCKS = 6;

/** A real, live-rendered miniature of a page, scaled down to fit its card. */
export function PageThumb({ content, className }: { content: PageContent; className?: string }) {
  const light = { ...content, blocks: content.blocks.filter((b) => !HEAVY.has(b.type)).slice(0, VISIBLE_BLOCKS) };
  return (
    <div className={cn("@container relative overflow-hidden bg-[#08090c]", className)} aria-hidden inert>
      {/* Rendered at (card width ÷ 0.52) — never narrower than a phone — then
          scaled by 0.52, so the page fills the card edge to edge. */}
      <div
        data-mode="vivid"
        className="pointer-events-none absolute top-0 left-1/2 flex min-h-[1000px] w-[max(390px,calc(100cqw/0.52))] origin-top -translate-x-1/2 scale-[0.52] flex-col select-none *:flex-1"
      >
        <PageRenderer content={light} embedded thumbnail hideBadge />
      </div>
    </div>
  );
}
