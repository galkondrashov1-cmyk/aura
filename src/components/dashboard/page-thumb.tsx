import { PageRenderer } from "@/components/renderer/page-renderer";
import type { PageContent } from "@/lib/blocks";
import { cn } from "@/lib/utils";

/** A real, live-rendered miniature of a page, scaled down to fit its card. */
export function PageThumb({ content, className }: { content: PageContent; className?: string }) {
  return (
    <div className={cn("@container relative overflow-hidden bg-[#08090c]", className)} aria-hidden>
      {/* Rendered at (card width ÷ 0.52) — never narrower than a phone — then
          scaled by 0.52, so the page fills the card edge to edge. */}
      <div
        data-mode="vivid"
        className="pointer-events-none absolute top-0 left-1/2 flex min-h-[1000px] w-[max(390px,calc(100cqw/0.52))] origin-top -translate-x-1/2 scale-[0.52] flex-col select-none *:flex-1"
      >
        <PageRenderer content={content} embedded thumbnail hideBadge />
      </div>
    </div>
  );
}
