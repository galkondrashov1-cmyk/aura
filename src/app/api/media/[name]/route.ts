import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR, EXT_MIME } from "@/lib/uploads";

type Params = { params: Promise<{ name: string }> };

// Serves an uploaded file from UPLOAD_DIR. Replaces static /public so newly
// uploaded files are available immediately in dev.
export async function GET(_req: Request, { params }: Params) {
  const { name } = await params;
  const safe = path.basename(name);
  if (!/^[\w-]+\.(png|jpe?g|webp|gif|svg)$/i.test(safe)) {
    return new Response("Not found", { status: 404 });
  }

  const ext = safe.split(".").pop()!.toLowerCase();
  try {
    const buf = await readFile(path.join(UPLOAD_DIR, safe));
    return new Response(new Uint8Array(buf), {
      headers: {
        "content-type": EXT_MIME[ext] ?? "application/octet-stream",
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
