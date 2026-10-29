import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { caps } from "@/lib/plans";
import { effectivePlanFrom } from "@/lib/plan-source";
import { SITE_URL } from "@/lib/site";

// Refreshed hourly; built without a database it lists just the marketing pages.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/signup`, changeFrequency: "yearly", priority: 0.5 },
  ];
  try {
    const users = await prisma.user.findMany({
      where: { status: "ACTIVE", pages: { some: { status: "PUBLISHED" } } },
      select: {
        username: true,
        plan: true,
        planExpiresAt: true,
        pages: {
          where: { status: "PUBLISHED" },
          orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
          select: { slug: true, isPrimary: true, publishedAt: true },
        },
      },
      take: 45_000,
    });
    // Same rule as the public routes: only pages within the plan's limit are online.
    const pages = users.flatMap((u) =>
      u.pages.slice(0, caps(effectivePlanFrom(u)).maxPages).map((p, i) => ({
        url: i === 0 ? `${SITE_URL}/${u.username}` : `${SITE_URL}/${u.username}/${p.slug}`,
        lastModified: p.publishedAt ?? undefined,
        changeFrequency: "weekly" as const,
        priority: i === 0 ? 0.7 : 0.5,
      })),
    );
    return [...base, ...pages];
  } catch {
    return base;
  }
}
