import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { asPlan, caps } from "@/lib/plans";
import { asContent } from "@/lib/content";
import { asDesign } from "@/lib/design";
import { Editor } from "@/components/editor";

export const metadata: Metadata = { title: "עיצוב העמוד" };

export default async function EditorPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const biz = await prisma.business.findUnique({
    where: { id: session.id },
    include: {
      site: true,
      services: { where: { active: true }, orderBy: { order: "asc" } },
      hours: true,
    },
  });
  if (!biz) redirect("/login");

  const plan = asPlan(biz.plan);

  return (
    <Editor
      businessName={biz.name}
      slug={biz.slug}
      plan={plan}
      bookingEnabled={caps(plan).booking}
      published={biz.site?.published ?? false}
      initialContent={asContent(biz.site?.content)}
      initialDesign={asDesign(biz.site?.design)}
      services={biz.services.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        durationMin: s.durationMin,
        price: s.price,
      }))}
      hours={biz.hours.map((h) => ({ day: h.day, startMin: h.startMin, endMin: h.endMin }))}
    />
  );
}
