import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { asPageContent } from "@/lib/blocks";
import { getEffectivePlan } from "@/lib/plan-source";
import { signDraft } from "@/lib/draft-token";
import { Editor } from "@/components/builder/editor";

type Params = { params: Promise<{ pageId: string }> };

export const metadata = { title: "Editor · AURA" };

export default async function BuilderPage({ params }: Params) {
  const { pageId } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const [page, plan] = await Promise.all([
    prisma.page.findFirst({ where: { id: pageId, userId: user.id } }),
    getEffectivePlan(user.id),
  ]);
  if (!page) notFound();

  return (
    <Editor
      pageId={page.id}
      username={user.username}
      slug={page.slug}
      isPrimary={page.isPrimary}
      published={page.status === "PUBLISHED"}
      publishedContent={page.publishedContent ? asPageContent(page.publishedContent) : null}
      plan={plan}
      draftToken={signDraft(page.id)}
      initialContent={asPageContent(page.draftContent ?? page.publishedContent)}
    />
  );
}
