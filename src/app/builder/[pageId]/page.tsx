import { titled } from "@/lib/brand";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { asPageContent } from "@/lib/blocks";
import { effectivePlanFrom } from "@/lib/plan-source";
import { signDraft } from "@/lib/draft-token";
import { Editor } from "@/components/builder/editor";
import { paypalConfigured } from "@/lib/paypal";

type Params = { params: Promise<{ pageId: string }> };

export const metadata = { title: titled("עורך") };

export default async function BuilderPage({ params }: Params) {
  const { pageId } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const plan = effectivePlanFrom(user);
  const page = await prisma.page.findFirst({ where: { id: pageId, userId: user.id } });
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
      payments={paypalConfigured()}
      draftToken={signDraft(page.id)}
      initialContent={asPageContent(page.draftContent ?? page.publishedContent)}
    />
  );
}
