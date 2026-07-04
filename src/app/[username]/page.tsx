import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageRenderer } from "@/components/renderer/page-renderer";
import { asPageContent } from "@/lib/blocks";
import { caps } from "@/lib/plans";
import { effectivePlanFrom } from "@/lib/plan-source";
import { toPlain } from "@/lib/richtext";

type Params = { params: Promise<{ username: string }> };

async function getPublishedPage(usernameRaw: string) {
  const username = usernameRaw.toLowerCase();
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.status !== "ACTIVE") return null;

  const page = await prisma.page.findFirst({
    where: { userId: user.id, status: "PUBLISHED" },
    orderBy: [{ isPrimary: "desc" }, { updatedAt: "desc" }],
  });
  if (!page?.publishedContent) return null;

  return { user, page };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { username } = await params;
  const data = await getPublishedPage(username);
  if (!data) return { title: "Not found · AURA" };

  const content = asPageContent(data.page.publishedContent);
  const hero = content.blocks.find((b) => b.type === "hero");
  // Custom SEO is a Pro capability — only honored while the owner is Pro.
  const seo = caps(effectivePlanFrom(data.user as { plan?: string; planExpiresAt?: string | null })).customSeo;
  const name =
    (seo ? content.design?.seoTitle : undefined) ??
    data.page.seoTitle ??
    (hero && hero.type === "hero" ? toPlain(hero.name) : data.user.username);

  return {
    title: `${name} · AURA`,
    description: (seo ? content.design?.seoDescription : undefined) ?? data.page.seoDescription ?? undefined,
  };
}

export default async function UserPage({ params }: Params) {
  const { username } = await params;
  const data = await getPublishedPage(username);
  if (!data) notFound();

  const content = asPageContent(data.page.publishedContent);
  const ownerPlan = effectivePlanFrom(data.user as { plan?: string; planExpiresAt?: string | null });
  return (
    <PageRenderer
      content={content}
      trackPageId={data.page.id}
      hideBadge={caps(ownerPlan).removeBadge}
    />
  );
}
