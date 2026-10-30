import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { asPageContent } from "@/lib/blocks";
import { effectivePlanFrom } from "@/lib/plan-source";
import { fitToPlan } from "@/lib/studio";
import { SITE_URL } from "@/lib/site";
import { vcard } from "@/lib/vcard";

// The Contact block's "save contact" file, built from the published page so
// nobody can mint arbitrary cards on our domain.
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams.get("p")?.slice(0, 40);
  const id = req.nextUrl.searchParams.get("b")?.slice(0, 80);
  const page = p
    ? await prisma.page.findUnique({
        where: { id: p },
        select: { slug: true, isPrimary: true, status: true, publishedContent: true, user: { select: { username: true, plan: true, planExpiresAt: true, status: true } } },
      })
    : null;
  const block =
    page?.status === "PUBLISHED" && page.user.status === "ACTIVE"
      ? fitToPlan(asPageContent(page.publishedContent), effectivePlanFrom(page.user)).blocks.find((b) => b.id === id)
      : undefined;
  if (!page || block?.type !== "contact") return new Response("Not found", { status: 404 });

  const file = encodeURIComponent(`${block.name || page.user.username}.vcf`);
  return new Response(vcard(block, `${SITE_URL}/${page.user.username}${page.isPrimary ? "" : `/${page.slug}`}`), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="contact.vcf"; filename*=UTF-8''${file}`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
