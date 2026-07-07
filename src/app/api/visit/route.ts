import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { slug, device } = await req.json();
    if (typeof slug !== "string") return NextResponse.json({ ok: false }, { status: 400 });
    const biz = await prisma.business.findUnique({
      where: { slug },
      select: { id: true, status: true, site: { select: { published: true } } },
    });
    if (!biz?.site?.published || biz.status !== "ACTIVE") {
      return NextResponse.json({ ok: false }, { status: 404 });
    }
    await prisma.visit.create({
      data: {
        businessId: biz.id,
        device: device === "mobile" ? "mobile" : "desktop",
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
