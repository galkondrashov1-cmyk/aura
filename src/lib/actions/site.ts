"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { asContent, type SiteContent } from "@/lib/content";
import { asDesign, resolveDesign, type SiteDesign } from "@/lib/design";
import { asPlan } from "@/lib/plans";

async function requireBiz() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function saveSite(input: { content: SiteContent; design: SiteDesign }) {
  const session = await requireBiz();
  const biz = await prisma.business.findUnique({
    where: { id: session.id },
    select: { plan: true, slug: true },
  });
  if (!biz) throw new Error("Unauthorized");

  // Persist only what the plan allows — the editor UI also gates, but the
  // server is the source of truth.
  const design = resolveDesign(asDesign(input.design), asPlan(biz.plan));
  const content = asContent(input.content);

  await prisma.site.update({
    where: { businessId: session.id },
    data: { content, design },
  });
  revalidatePath(`/${biz.slug}`);
  return { ok: true };
}

export async function publishSite(publish: boolean) {
  const session = await requireBiz();
  await prisma.site.update({
    where: { businessId: session.id },
    data: { published: publish, publishedAt: publish ? new Date() : undefined },
  });
  revalidatePath(`/${session.slug}`);
  revalidatePath("/dashboard");
  return { ok: true };
}
