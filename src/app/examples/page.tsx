import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageRenderer } from "@/components/renderer/page-renderer";
import { SiteNav, Footer } from "@/components/marketing";
import { buttonClasses } from "@/components/ui/button";
import { templates } from "@/lib/templates";
import { asPageContent } from "@/lib/blocks";

export const metadata: Metadata = {
  title: "Examples · AURA",
  description: "See what you can build with AURA.",
};

export default async function ExamplesPage() {
  const published = await prisma.page.findMany({
    where: { status: "PUBLISHED", isPrimary: true, user: { status: "ACTIVE" } },
    include: { user: { select: { username: true } } },
    orderBy: { publishedAt: "desc" },
    take: 6,
  });

  return (
    <div className="min-h-screen">
      <div className="aura-backdrop">
        <SiteNav />
        <div className="mx-auto max-w-6xl px-6 pt-12 pb-4 text-center">
          <h1 className="font-display text-4xl font-medium tracking-tight md:text-5xl">
            See what you can build
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-text-muted">
            Real pages and starter templates. Make any of them yours in minutes.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        {published.length > 0 && (
          <>
            <h2 className="font-display text-2xl font-medium tracking-tight">Live pages</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {published.map((page) => (
                <div
                  key={page.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface"
                >
                  <div className="h-72 overflow-hidden border-b border-border">
                    <div className="pointer-events-none origin-top scale-[0.72]">
                      <PageRenderer content={asPageContent(page.publishedContent)} embedded />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <span className="text-sm text-text-muted">
                      useaura.me/{page.user.username}
                    </span>
                    <Link
                      href={`/${page.user.username}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-primary"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Visit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <h2 className="font-display mt-16 text-2xl font-medium tracking-tight">
          Start from a template
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-primary/40"
            >
              <div className="pointer-events-none h-64 overflow-hidden border-b border-border">
                <div className="origin-top scale-[0.72]">
                  <PageRenderer content={tpl.content} embedded />
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="font-display text-base font-medium">{tpl.name}</span>
                <span className="text-xs text-text-muted group-hover:text-primary">Use →</span>
              </div>
              <Link
                href="/signup"
                aria-label={`Use the ${tpl.name} template`}
                className="absolute inset-0"
              />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/signup" className={buttonClasses("primary", "lg")}>
            Create your AURA
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
