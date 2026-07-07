import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { freeSlots } from "@/lib/slots";
import { asPlan, caps } from "@/lib/plans";

// GET /api/slots?slug=…&serviceId=…&date=YYYY-MM-DD
export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug") ?? "";
  const serviceId = url.searchParams.get("serviceId") ?? "";
  const date = url.searchParams.get("date") ?? "";

  const biz = await prisma.business.findUnique({
    where: { slug },
    select: { id: true, plan: true, status: true, site: { select: { published: true } } },
  });
  if (!biz?.site?.published || biz.status !== "ACTIVE" || !caps(asPlan(biz.plan)).booking) {
    return NextResponse.json({ slots: [] }, { status: 404 });
  }
  const service = await prisma.service.findFirst({
    where: { id: serviceId, businessId: biz.id, active: true },
  });
  if (!service) return NextResponse.json({ slots: [] }, { status: 404 });

  const slots = await freeSlots({
    businessId: biz.id,
    dateStr: date,
    durationMin: service.durationMin,
  });
  return NextResponse.json({ slots });
}
