import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { asPageContent } from "@/lib/blocks";
import { asPlan } from "@/lib/plans";
import { signDraft } from "@/lib/draft-token";
import { Editor } from "@/components/builder/editor";

type Params = { params: Promise<{ pageId: string }> };

export default async function BuilderPage({ params }: Params) {
  const { pageId } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const page = await prisma.page.findFirst({
    where: { id: pageId, userId: user.id },
  });
  if (!page) notFound();

  return (
    <Editor
      pageId={page.id}
      username={user.username}
      published={page.status === "PUBLISHED"}
      plan={asPlan(user.plan)}
      draftToken={signDraft(page.id)}
      initialContent={asPageContent(page.draftContent)}
    />
  );
}
