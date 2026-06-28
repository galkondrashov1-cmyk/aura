import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Stores a contact-form submission for a published page (public endpoint).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.pageId !== "string") {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  const name = String(body.name ?? "").slice(0, 200);
  const email = String(body.email ?? "").slice(0, 200);
  const message = String(body.message ?? "").slice(0, 5000);
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Only accept submissions for a real, published page.
  const page = await prisma.page.findFirst({
    where: { id: body.pageId, status: "PUBLISHED" },
    select: { id: true },
  });
  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.formSubmission.create({
    data: { pageId: page.id, data: { name, email, message } },
  });

  return NextResponse.json({ ok: true });
}
