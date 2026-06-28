import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { deviceFromUA, safeUrl } from "@/lib/track";

// Click redirect tracker: records a LinkClick, then 302s to the target.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageId = searchParams.get("p");
  const target = safeUrl(searchParams.get("u"));
  const label = searchParams.get("l") ?? undefined;

  if (!target) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pageId) {
    const device = deviceFromUA(req.headers.get("user-agent"));
    await prisma.linkClick
      .create({ data: { pageId, url: target, label, device } })
      .catch(() => {});
  }

  return NextResponse.redirect(target);
}
