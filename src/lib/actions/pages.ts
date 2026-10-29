"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { Block, PageContent } from "@/lib/blocks";
import { asPageContent, heroOf } from "@/lib/blocks";
import { toPlain } from "@/lib/richtext";
import { caps } from "@/lib/plans";
import { getEffectivePlan } from "@/lib/plan-source";
import { livePages, revalidateUser } from "@/lib/public-page";
import { SLUG_RE, toSlug } from "@/lib/reserved";
import { TEMPLATES, templateContent } from "@/lib/templates";

async function requireUser() {
  const user = await getSession();
  if (!user) redirect("/login");
  return user;
}

// A page document is small JSON; anything near this is abuse, not a page.
const MAX_CONTENT_BYTES = 400_000;

function personalize(content: PageContent, name: string): PageContent {
  const blocks = content.blocks.map((b): Block =>
    b.type === "hero" && toPlain(b.name) === "Your Name" ? { ...b, name } : b,
  );
  return { ...content, blocks };
}

/** "gal_kondrashov" → "Gal Kondrashov" — a friendlier first headline. */
function displayName(user: { name: string | null; username: string }): string {
  if (user.name?.trim()) return user.name.trim();
  return user.username
    .split("_")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function heroName(content: PageContent): string {
  const hero = heroOf(content);
  return (hero && toPlain(hero.name).slice(0, 80)) || "Untitled";
}

function checked(content: PageContent): PageContent {
  const safe = asPageContent(content);
  if (JSON.stringify(safe).length > MAX_CONTENT_BYTES) {
    throw new Error("This page is too large to save.");
  }
  return safe;
}

async function uniqueSlug(userId: string, base: string): Promise<string> {
  const root = toSlug(base) || "page";
  const taken = new Set(
    (await prisma.page.findMany({ where: { userId }, select: { slug: true } })).map((p) => p.slug),
  );
  if (!taken.has(root)) return root;
  for (let i = 2; i < 500; i++) if (!taken.has(`${root}-${i}`)) return `${root}-${i}`;
  return `${root}-${Date.now().toString(36)}`;
}

/** New page — blank, or from a starter template (form field `template`). */
export async function createPage(formData?: FormData) {
  const user = await requireUser();
  const templateId = String(formData?.get("template") ?? "");
  const template = TEMPLATES.find((t) => t.id === templateId);
  const plan = await getEffectivePlan(user.id);
  const recipe = templateId === "blank" ? "blank" : template?.id;
  // The whole template, premium touches included: the editor previews them and
  // says which ones the live page needs a plan for (try before you buy).
  const content = personalize(templateContent(recipe), displayName(user));

  const count = await prisma.page.count({ where: { userId: user.id } });
  // Plan limit: Free = 1 page, Plus = 5, Pro = unlimited.
  if (count >= caps(plan).maxPages) {
    redirect("/dashboard/upgrade?limit=pages");
  }
  const slug = count === 0 ? "home" : await uniqueSlug(user.id, template?.slug ?? `page-${count + 1}`);

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
  const safe = checked(content);

  await prisma.page.updateMany({
    where: { id: pageId, userId: user.id },
    data: { draftContent: safe, theme: "vivid", title: heroName(safe) },
  });

  return { ok: true as const, savedAt: Date.now() };
}

export async function publishPage(pageId: string, content: PageContent) {
  const user = await requireUser();
  const safe = checked(content);

  const page = await prisma.page.findFirst({
    where: { id: pageId, userId: user.id },
    select: { slug: true, isPrimary: true },
  });
  if (!page) return { ok: false as const };

  await prisma.page.update({
    where: { id: pageId },
    data: {
      draftContent: safe,
      publishedContent: safe,
      theme: "vivid",
      title: heroName(safe),
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  await revalidateUser(user.id);
  const path = page.isPrimary ? `/${user.username}` : `/${user.username}/${page.slug}`;
  // Published but over the plan's page limit: saved, yet not online.
  const plan = await getEffectivePlan(user.id);
  const online = (await livePages(user.id, plan)).some((p) => p.id === pageId);
  return { ok: true as const, url: path, offline: !online, maxPages: caps(plan).maxPages };
}

/** Take a page offline without deleting it. */
export async function unpublishPage(pageId: string) {
  const user = await requireUser();
  await prisma.page.updateMany({
    where: { id: pageId, userId: user.id },
    data: { status: "DRAFT" },
  });
  await revalidateUser(user.id);
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function deletePage(pageId: string) {
  const user = await requireUser();
  const page = await prisma.page.findFirst({ where: { id: pageId, userId: user.id }, select: { isPrimary: true } });
  await prisma.page.deleteMany({ where: { id: pageId, userId: user.id } });
  // Keep exactly one main page: promote the most recently edited survivor.
  if (page?.isPrimary) {
    const next = await prisma.page.findFirst({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } });
    if (next) await prisma.page.update({ where: { id: next.id }, data: { isPrimary: true } });
  }
  await revalidateUser(user.id);
  redirect("/dashboard");
}

export async function duplicatePage(pageId: string) {
  const user = await requireUser();
  const src = await prisma.page.findFirst({ where: { id: pageId, userId: user.id } });
  if (!src) redirect("/dashboard");
  const count = await prisma.page.count({ where: { userId: user.id } });
  if (count >= caps(await getEffectivePlan(user.id)).maxPages) {
    redirect("/dashboard/upgrade?limit=pages");
  }
  const copy = await prisma.page.create({
    data: {
      userId: user.id,
      slug: await uniqueSlug(user.id, `${src.slug}-copy`),
      title: `${src.title} (copy)`.slice(0, 90),
      status: "DRAFT",
      isPrimary: false,
      theme: src.theme,
      draftContent: src.draftContent ?? src.publishedContent ?? undefined,
    },
  });
  redirect(`/builder/${copy.id}`);
}

/** Make this the page shown at useaura.me/<username>. */
export async function setPrimaryPage(pageId: string) {
  const user = await requireUser();
  const page = await prisma.page.findFirst({ where: { id: pageId, userId: user.id }, select: { id: true } });
  if (!page) return;
  await prisma.$transaction([
    prisma.page.updateMany({ where: { userId: user.id }, data: { isPrimary: false } }),
    prisma.page.update({ where: { id: page.id }, data: { isPrimary: true } }),
  ]);
  await revalidateUser(user.id);
  revalidatePath("/dashboard");
}

export type SlugState = { ok?: boolean; error?: string; slug?: string } | undefined;

export async function updatePageSlug(pageId: string, _prev: SlugState, formData: FormData): Promise<SlugState> {
  const user = await requireUser();
  const slug = toSlug(String(formData.get("slug") ?? ""));
  if (!SLUG_RE.test(slug)) return { error: "Use letters, numbers and dashes." };
  const clash = await prisma.page.findFirst({
    where: { userId: user.id, slug, NOT: { id: pageId } },
    select: { id: true },
  });
  if (clash) return { error: "You already have a page with that address." };
  await prisma.page.updateMany({ where: { id: pageId, userId: user.id }, data: { slug } });
  await revalidateUser(user.id);
  revalidatePath("/dashboard");
  return { ok: true, slug };
}
