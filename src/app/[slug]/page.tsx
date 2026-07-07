import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { asPlan, caps } from "@/lib/plans";
import { asContent } from "@/lib/content";
import { resolveDesign } from "@/lib/design";
import { SiteRenderer } from "@/components/site-renderer";
import { VisitBeacon } from "@/components/visit-beacon";

type Props = { params: Promise<{ slug: string }> };

async function loadBusiness(slug: string) {
  return prisma.business.findUnique({
    where: { slug },
    include: {
      site: true,
      services: { where: { active: true }, orderBy: { order: "asc" } },
      hours: true,
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const biz = await loadBusiness(slug);
  if (!biz?.site?.published) return { title: "הילה" };
  const content = asContent(biz.site.content);
  return {
    title: biz.name,
    description: content.tagline || content.about?.slice(0, 150) || `${biz.name} — הילה`,
  };
}

export default async function PublicBusinessPage({ params }: Props) {
  const { slug } = await params;
  const biz = await loadBusiness(slug);
  if (!biz || !biz.site) notFound();
  if (biz.status !== "ACTIVE") notFound(); // suspended by admin

  // Owners can preview their own draft; everyone else sees published only.
  const session = await getSession();
  const isOwner = session?.id === biz.id;
  if (!biz.site.published && !isOwner) notFound();

  const plan = asPlan(biz.plan);
  const content = asContent(biz.site.content);
  const design = resolveDesign(biz.site.design, plan);
  const bookingEnabled = caps(plan).booking && biz.services.length > 0;

  return (
    <div className="min-h-dvh">
      {isOwner && !biz.site.published && (
        <div className="sticky top-0 z-40 bg-yellow-500 px-4 py-2 text-center text-sm font-bold text-black">
          תצוגה מקדימה — העמוד עדיין לא פורסם.{" "}
          <Link href="/dashboard" className="underline">
            ללוח הבקרה
          </Link>
        </div>
      )}
      {biz.site.published && !isOwner && <VisitBeacon slug={slug} />}
      <div className="min-h-dvh">
        <SiteRenderer
          businessName={biz.name}
          slug={biz.slug}
          content={content}
          design={design}
          services={biz.services.map((s) => ({
            id: s.id,
            name: s.name,
            description: s.description,
            durationMin: s.durationMin,
            price: s.price,
          }))}
          hours={biz.hours.map((h) => ({ day: h.day, startMin: h.startMin, endMin: h.endMin }))}
          bookingEnabled={bookingEnabled}
        />
      </div>
    </div>
  );
}
