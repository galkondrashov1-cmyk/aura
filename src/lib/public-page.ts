import { cache } from "react";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { asPageContent, heroOf, type PageContent } from "@/lib/blocks";
import { caps, type Caps, type Plan } from "@/lib/plans";
import { effectivePlanFrom } from "@/lib/plan-source";
import { toPlain } from "@/lib/richtext";
import { fitToPlan } from "@/lib/studio";

export type PublicPage = {
  pageId: string;
  username: string;
  slug: string;
  /** Already fitted to the owner's plan — paid features render only while paid for. */
  content: PageContent;
  plan: Plan;
  caps: Caps;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

/**
 * A user's published page — the primary one when `slug` is omitted.
 * Wrapped in React cache() so generateMetadata, the page and the OG image
 * share one lookup per render; the route itself is ISR-cached and refreshed
 * by revalidateUser() on publish.
 */
export const getPublicPage = cache(async (usernameRaw: string, slug?: string): Promise<PublicPage | null> => {
  const username = decodeURIComponent(usernameRaw).toLowerCase();
  if (!/^[a-z0-9_]{3,20}$/.test(username)) return null;
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, status: true, plan: true, planExpiresAt: true },
  });
  if (!user || user.status !== "ACTIVE") return null;

  const plan = effectivePlanFrom(user);
  const live = await livePages(user.id, plan);
  const target = slug ? live.find((p) => p.slug === slug.toLowerCase()) : live[0];
  if (!target) return null;
  const page = await prisma.page.findUnique({
    where: { id: target.id },
    select: { id: true, slug: true, publishedContent: true, seoTitle: true, seoDescription: true },
  });
  if (!page?.publishedContent) return null;

  return {
    pageId: page.id,
    username: user.username,
    slug: page.slug,
    content: fitToPlan(asPageContent(page.publishedContent), plan),
    plan,
    caps: caps(plan),
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
  };
});

/**
 * The published pages that are actually online. The plan's page limit keeps
 * the main page first, then the oldest — so after a downgrade the extra pages
 * go offline (never deleted) and come back on upgrade.
 */
export async function livePages(userId: string, plan: Plan) {
  const pages = await prisma.page.findMany({
    where: { userId, status: "PUBLISHED" },
    orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
    select: { id: true, slug: true },
  });
  return pages.slice(0, caps(plan).maxPages);
}

export function publicMetadata(data: PublicPage | null, path: string): Metadata {
  if (!data) return { title: "Not found · AURA" };
  const { content } = data;
  const hero = heroOf(content);
  const seo = data.caps.customSeo;
  const name =
    (seo ? content.design?.seoTitle : undefined) ||
    data.seoTitle ||
    (hero ? toPlain(hero.name) : data.username);
  const description =
    (seo ? content.design?.seoDescription : undefined) ||
    data.seoDescription ||
    (hero ? toPlain(hero.tagline) : undefined) ||
    `${name} on AURA`;
  // Pro: the creator's photo is the browser-tab icon instead of AURA's.
  const avatar = hero?.avatarUrl && /^(https:\/\/|\/api\/media\/)/.test(hero.avatarUrl) ? hero.avatarUrl : null;
  return {
    title: `${name} · AURA`,
    description,
    ...(data.caps.customFavicon && avatar ? { icons: { icon: avatar, apple: avatar } } : {}),
    alternates: { canonical: path },
    openGraph: { title: name, description, type: "profile", url: path },
    twitter: { card: "summary_large_image", title: name, description },
  };
}

/**
 * Refresh every public URL of a user after anything that changes what
 * visitors see: publish, delete, plan change, suspension, rename.
 */
export async function revalidateUser(userId: string, extraUsernames: string[] = []) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true, pages: { select: { slug: true } } },
  });
  const names = new Set(extraUsernames);
  if (user) names.add(user.username);
  for (const name of names) {
    revalidatePath(`/${name}`);
    for (const p of user?.pages ?? []) revalidatePath(`/${name}/${p.slug}`);
  }
}
