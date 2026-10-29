import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { deviceFromUA, isBot, safeUrl } from "@/lib/track";
import { verifyClick } from "@/lib/links-server";

// Click redirect tracker: records a LinkClick, then 302s to the target. The
// target must carry a valid signature minted when the page was rendered, so
// this endpoint can't be used as an open redirect.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageId = searchParams.get("p") ?? "";
  const target = safeUrl(searchParams.get("u"));
  const sig = searchParams.get("s") ?? "";
  const label = searchParams.get("l")?.slice(0, 80) ?? undefined;

  if (!target || !pageId || !verifyClick(pageId, target, sig)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const ua = req.headers.get("user-agent");
  if (!isBot(ua)) {
    await prisma.linkClick
      .create({ data: { pageId, url: target, label, device: deviceFromUA(ua) } })
      .catch(() => {});
  }

  return NextResponse.redirect(target);
}
