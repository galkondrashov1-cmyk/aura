import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { verifyDraft } from "@/lib/draft-token";
import { asPageContent } from "@/lib/blocks";
import { caps } from "@/lib/plans";
import { effectivePlanFrom } from "@/lib/plan-source";
import { PageRenderer } from "@/components/renderer/page-renderer";

type Params = { params: Promise<{ token: string }> };

// Draft previews should never be indexed.
export const metadata: Metadata = {
  title: "Draft preview · AURA",
  robots: { index: false, follow: false },
};

export default async function DraftPreview({ params }: Params) {
  const { token } = await params;
  const pageId = verifyDraft(token);
  if (!pageId) notFound();

  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: { user: true },
  });
  if (!page) notFound();

  const content = asPageContent(page.draftContent ?? page.publishedContent);
  const ownerPlan = effectivePlanFrom(page.user as { plan?: string; planExpiresAt?: string | null });

  return (
    <div className="relative">
      <div className="pointer-events-none fixed top-3 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border bg-surface/90 px-3 py-1 text-xs text-text-muted backdrop-blur">
        Draft preview · not public
      </div>
      <PageRenderer content={content} hideBadge={caps(ownerPlan).removeBadge} />
    </div>
  );
}
