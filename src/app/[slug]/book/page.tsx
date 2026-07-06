import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { asPlan, caps } from "@/lib/plans";
import { resolveDesign } from "@/lib/design";
import { asContent } from "@/lib/content";
import { BookingWizard } from "@/components/booking-wizard";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const biz = await prisma.business.findUnique({ where: { slug }, select: { name: true } });
  return { title: biz ? `קביעת תור · ${biz.name}` : "קביעת תור" };
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  const biz = await prisma.business.findUnique({
    where: { slug },
    include: {
      site: true,
      services: { where: { active: true }, orderBy: { order: "asc" } },
      hours: true,
    },
  });
  if (!biz?.site?.published) notFound();
  const plan = asPlan(biz.plan);
  if (!caps(plan).booking || biz.services.length === 0) notFound();

  const content = asContent(biz.site.content);
  const design = resolveDesign(biz.site.design, plan);

  return (
    <BookingWizard
      slug={biz.slug}
      businessName={biz.name}
      emoji={content.emoji}
      design={design}
      autoConfirm={biz.autoConfirm}
      workDays={biz.hours.map((h) => h.day)}
      services={biz.services.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        durationMin: s.durationMin,
        price: s.price,
      }))}
    />
  );
}
