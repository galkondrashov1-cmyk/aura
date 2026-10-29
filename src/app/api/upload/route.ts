import { NextResponse, type NextRequest } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { UPLOAD_DIR, MIME_EXT, sniffImage } from "@/lib/uploads";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

// Uploads go to Vercel Blob when BLOB_READ_WRITE_TOKEN is set (production), and
// fall back to the local filesystem in development. Either way we return a URL
// the renderer can use and record a MediaAsset.
export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "לא נבחר קובץ" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "הקובץ גדול מדי (עד 5MB)" }, { status: 400 });
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffImage(bytes.subarray(0, 16));
  const ext = type && MIME_EXT[type];
  if (!type || !ext) {
    return NextResponse.json({ error: "השתמשו בתמונה מסוג JPG, PNG, WebP, GIF או AVIF." }, { status: 400 });
  }

  // Flood control: plenty for designing a page, useless for abuse.
  const [lastHour, lastDay] = await Promise.all([
    prisma.mediaAsset.count({ where: { userId: user.id, createdAt: { gte: new Date(Date.now() - 3_600_000) } } }),
    prisma.mediaAsset.count({ where: { userId: user.id, createdAt: { gte: new Date(Date.now() - 86_400_000) } } }),
  ]);
  if (lastHour >= 60 || lastDay >= 300) {
    return NextResponse.json({ error: "הגעתם למגבלת ההעלאות — נסו שוב מעט מאוחר יותר." }, { status: 429 });
  }

  const name = `${randomUUID()}.${ext}`;
  let url: string;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`media/${name}`, Buffer.from(bytes), {
      access: "public",
      contentType: type,
    });
    url = blob.url;
  } else {
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), bytes);
    url = `/api/media/${name}`;
  }

  await prisma.mediaAsset.create({
    data: { userId: user.id, url, type: "IMAGE", sizeBytes: file.size },
  });

  return NextResponse.json({ url });
}
