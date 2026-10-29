import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

type Entry = { kind?: string; email?: string; name?: string | null; message?: string | null };

// Spreadsheet apps execute cells starting with = + - @ — neutralize them.
function cell(v: unknown): string {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

/** All form submissions for the signed-in user's pages, as CSV. */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subs = await prisma.formSubmission.findMany({
    where: { page: { userId: session.id } },
    orderBy: { createdAt: "desc" },
    select: { data: true, createdAt: true, page: { select: { title: true } } },
  });
  const rows = [["Date", "Type", "Name", "Email", "Message", "Page"]];
  for (const s of subs) {
    const d = (s.data ?? {}) as Entry;
    rows.push([s.createdAt.toISOString(), d.kind ?? "", d.name ?? "", d.email ?? "", d.message ?? "", s.page.title]);
  }
  const csv = "﻿" + rows.map((r) => r.map(cell).join(",")).join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="aura-inbox.csv"',
      "cache-control": "no-store",
    },
  });
}
