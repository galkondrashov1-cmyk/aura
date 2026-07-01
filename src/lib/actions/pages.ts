"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { Block, PageContent } from "@/lib/blocks";
import { asPageContent } from "@/lib/blocks";
import { toPlain } from "@/lib/richtext";
import { asPlan, caps } from "@/lib/plans";

async function requireUser() {
  const user = await getSession();
  if (!user) redirect("/login");
  return user;
}

/** A fresh page starts from this minimal, ready-to-edit layout. */
const DEFAULT_PAGE: PageContent = {
  blocks: [
    { id: "hero", type: "hero", name: "Your Name", tagline: "What you do" },
    {
      id: "links",
      type: "links",
      items: [
        { label: "My website", url: "https://", highlighted: true },
        { label: "Say hello", url: "mailto:you@email.com" },
      ],
    },
  ],
};

function personalize(content: PageContent, name: string): PageContent {
  const blocks = content.blocks.map((b): Block =>
    b.type === "hero" && toPlain(b.name) === "Your Name" ? { ...b, name } : b,
  );
  return { ...content, blocks };
}

function heroName(content: PageContent): string {
  const hero = content.blocks.find((b) => b.type === "hero");
  return (hero && hero.type === "hero" && toPlain(hero.name)) || "Untitled";
}

export async function createPage() {
  const user = await requireUser();
  const content = personalize(DEFAULT_PAGE, user.name ?? user.username);

  const count = await prisma.page.count({ where: { userId: user.id } });
  // Plan limit: Free = 1 page, Plus = 5, Pro = unlimited.
  if (count >= caps(asPlan(user.plan)).maxPages) {
    redirect("/dashboard/upgrade?limit=pages");
  }
  const slug = count === 0 ? "home" : `page-${count + 1}`;

  const page = await prisma.page.create({
    data: {
      userId: user.id,
      slug,
      title: heroName(content),
      status: "DRAFT",
      isPrimary: count === 0,
      theme: "vivid",
      draftContent: content,
    },
  });

  redirect(`/builder/${page.id}`);
}

export async function savePage(pageId: string, content: PageContent) {
  const user = await requireUser();
  const safe = asPageContent(content);

  await prisma.page.updateMany({
    where: { id: pageId, userId: user.id },
    data: { draftContent: safe, theme: "vivid", title: heroName(safe) },
  });

  return { ok: true as const };
}

export async function publishPage(pageId: string, content: PageContent) {
  const user = await requireUser();
  const safe = asPageContent(content);

  await prisma.page.updateMany({
    where: { id: pageId, userId: user.id },
    data: {
      draftContent: safe,
      publishedContent: safe,
      theme: "vivid",
      title: heroName(safe),
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  revalidatePath(`/${user.username}`);
  return { ok: true as const, url: `/${user.username}` };
}

export async function deletePage(pageId: string) {
  const user = await requireUser();
  await prisma.page.deleteMany({ where: { id: pageId, userId: user.id } });
  revalidatePath(`/${user.username}`);
  redirect("/dashboard");
}
