import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { asPageContent } from "@/lib/blocks";

const schema = z.object({
  pageId: z.string().min(1).max(40),
  blockId: z.string().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(160),
  name: z.string().trim().max(80).optional(),
  message: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional().or(z.literal("")).or(z.null()), // honeypot must stay empty
});

// Newsletter / contact submissions from a published page's Form block. They
// land in the owner's Inbox (FormSubmission).
export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  const { pageId, blockId, email, name, message, website } = parsed.data;
  if (website) return NextResponse.json({ ok: true }); // bot — pretend success

  const page = await prisma.page.findUnique({
    where: { id: pageId },
    select: { status: true, publishedContent: true },
  });
  const block = page?.status === "PUBLISHED"
    ? asPageContent(page.publishedContent).blocks.find((b) => b.id === blockId && b.type === "form")
    : undefined;
  if (!block || block.type !== "form") {
    return NextResponse.json({ error: "This form is no longer available." }, { status: 404 });
  }
  if (block.kind === "contact" && (!name || !message)) {
    return NextResponse.json({ error: "Please fill in every field." }, { status: 400 });
  }

  // Light flood control: at most ~20 submissions per page per minute.
  const recent = await prisma.formSubmission.count({
    where: { pageId, createdAt: { gte: new Date(Date.now() - 60_000) } },
  });
  if (recent > 20) {
    return NextResponse.json({ error: "Too many submissions — try again in a minute." }, { status: 429 });
  }

  await prisma.formSubmission.create({
    data: {
      pageId,
      data: { blockId, kind: block.kind, email, name: name ?? null, message: message ?? null },
    },
  });
  return NextResponse.json({ ok: true });
}
