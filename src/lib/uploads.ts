import path from "node:path";

// Where uploaded files live. Set UPLOAD_DIR (absolute) in .env so it's stable
// regardless of the dev server's cwd. Files are served by /api/media/[name],
// not static /public — so this works in dev no matter where the process runs.
export const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), ".uploads");

// Raster images only. SVG is deliberately excluded: it can carry script.
export const MIME_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export const EXT_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

/** The real image type from the file's first bytes — the browser's claim isn't trusted. */
export function sniffImage(head: Uint8Array): string | null {
  const ascii = (from: number, to: number) => String.fromCharCode(...head.subarray(from, to));
  if (head[0] === 0x89 && ascii(1, 4) === "PNG") return "image/png";
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return "image/jpeg";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  if (ascii(0, 4) === "GIF8") return "image/gif";
  if (ascii(4, 8) === "ftyp" && /^avi[fs]$/.test(ascii(8, 12))) return "image/avif";
  return null;
}
