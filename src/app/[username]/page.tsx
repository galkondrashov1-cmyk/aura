import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageRenderer } from "@/components/renderer/page-renderer";
import { asPageContent } from "@/lib/blocks";
import { asPlan, caps } from "@/lib/plans";
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
  // Custom SEO (Pro) set in the design studio wins, then legacy columns.
  const name =
    content.design?.seoTitle ??
    data.page.seoTitle ??
    (hero && hero.type === "hero" ? toPlain(hero.name) : data.user.username);

  return {
    title: `${name} · AURA`,
    description: content.design?.seoDescription ?? data.page.seoDescription ?? undefined,
  };
}

export default async function UserPage({ params }: Params) {
  const { username } = await params;
  const data = await getPublishedPage(username);
  if (!data) notFound();

  const content = asPageContent(data.page.publishedContent);
  const ownerPlan = asPlan((data.user as { plan?: string }).plan);
  return (
    <PageRenderer
      content={content}
      trackPageId={data.page.id}
      hideBadge={caps(ownerPlan).removeBadge}
    />
  );
}
