import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { deviceFromUA } from "@/lib/track";

// Records a PageView. Called once per public page load via a client beacon.
export async function POST(req: NextRequest) {
  const { pageId } = await req.json().catch(() => ({ pageId: null }));

  if (typeof pageId === "string" && pageId) {
    const device = deviceFromUA(req.headers.get("user-agent"));
    const referrer = req.headers.get("referer") ?? undefined;
    await prisma.pageView.create({ data: { pageId, device, referrer } }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
