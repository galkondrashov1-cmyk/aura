"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getTemplate } from "@/lib/templates";
import type { Block, PageContent } from "@/lib/blocks";
import { asPageContent } from "@/lib/blocks";
import { toPlain } from "@/lib/richtext";
import { generatePageContent } from "@/lib/ai";

async function requireUser() {
  const user = await getSession();
  if (!user) redirect("/login");
  return user;
}

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

export async function createPage(templateId: string) {
  const user = await requireUser();
  const content = personalize(getTemplate(templateId), user.name ?? user.username);

  const count = await prisma.page.count({ where: { userId: user.id } });
  const slug = count === 0 ? "home" : `page-${count + 1}`;

  const page = await prisma.page.create({
    data: {
      userId: user.id,
      slug,
      title: heroName(content),
      status: "DRAFT",
      isPrimary: count === 0,
      theme: content.theme,
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
    data: { draftContent: safe, theme: safe.theme, title: heroName(safe) },
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
      theme: safe.theme,
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

export type AiState = { error?: string } | undefined;

export async function aiGenerateAction(
  _prev: AiState,
  formData: FormData,
): Promise<AiState> {
  const user = await requireUser();
  const prompt = String(formData.get("prompt") ?? "").trim();
  if (prompt.length < 8) {
    return { error: "Tell me a bit more about you — at least a sentence." };
  }

  let content: PageContent;
  try {
    content = await generatePageContent(prompt);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Generation failed" };
  }
  if (content.blocks.length === 0) {
    return { error: "The AI returned an empty page — try rephrasing." };
  }

  const count = await prisma.page.count({ where: { userId: user.id } });
  const slug = count === 0 ? "home" : `page-${count + 1}`;
  const page = await prisma.page.create({
    data: {
      userId: user.id,
      slug,
      title: heroName(content),
      status: "DRAFT",
      isPrimary: count === 0,
      theme: content.theme,
      draftContent: content,
    },
  });

  redirect(`/builder/${page.id}`);
}
