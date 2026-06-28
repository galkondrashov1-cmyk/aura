import { NextResponse, type NextRequest } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { UPLOAD_DIR, MIME_EXT } from "@/lib/uploads";

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
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = MIME_EXT[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const name = `${randomUUID()}.${ext}`;
  let url: string;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`media/${name}`, file, {
      access: "public",
      contentType: file.type,
    });
    url = blob.url;
  } else {
    const buffer = Buffer.from(await file.arrayBuffer());
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, name), buffer);
    url = `/api/media/${name}`;
  }

  await prisma.mediaAsset.create({
    data: { userId: user.id, url, type: "IMAGE", sizeBytes: file.size },
  });

  return NextResponse.json({ url });
}
