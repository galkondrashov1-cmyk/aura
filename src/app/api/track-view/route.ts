import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { deviceFromUA, isBot, referrerHost } from "@/lib/track";

// Records a PageView. Called once per visitor per 30 min via a client beacon.
// Bots and the page's own owner (previewing their page) are not counted.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const pageId = typeof body?.pageId === "string" ? body.pageId : "";
  const ua = req.headers.get("user-agent");
  if (!pageId || pageId.length > 40 || isBot(ua)) return NextResponse.json({ ok: true });

  const page = await prisma.page.findUnique({ where: { id: pageId }, select: { userId: true, status: true } });
  if (page?.status !== "PUBLISHED") return NextResponse.json({ ok: true });
  const viewer = await getSession();
  if (viewer?.id === page.userId) return NextResponse.json({ ok: true, owner: true });

  await prisma.pageView
    .create({
      data: {
        pageId,
        device: deviceFromUA(ua),
        referrer: referrerHost(body?.ref, req.headers.get("host")),
        country: req.headers.get("x-vercel-ip-country")?.slice(0, 2) || null,
      },
    })
    .catch(() => {});

  return NextResponse.json({ ok: true });
}
