// Browser-side image helpers for the builder: shrink photos before upload,
// and sample a photo's palette for "match my photo".

const PASSTHROUGH = new Set(["image/gif"]);

/**
 * Downscale to at most `maxDim` px and re-encode as WebP. A 6 MB phone photo
 * typically becomes ~200 KB — faster uploads and much faster public pages.
 * GIFs (animation) pass through untouched; if anything fails we fall
 * back to the original file.
 */
export async function compressImage(file: File, maxDim = 1600, quality = 0.84): Promise<File> {
  if (PASSTHROUGH.has(file.type) || !file.type.startsWith("image/")) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * scale));
    const h = Math.max(1, Math.round(bmp.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close?.();
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", quality));
    if (!blob || (blob.size >= file.size && scale === 1)) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".webp", { type: "image/webp" });
  } catch {
    return file;
  }
}

/** Upload through /api/upload (compressing first). Returns the public URL. */
export async function uploadImage(file: File, maxDim?: number): Promise<string> {
  const small = await compressImage(file, maxDim);
  const fd = new FormData();
  fd.append("file", small);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !json.url) throw new Error(json.error || "ההעלאה נכשלה");
  return json.url;
}

/**
 * The image's dominant colors, most common first (coarse 4-bit-per-channel
 * buckets, ignoring near-black / near-white / grey pixels).
 */
export async function samplePalette(url: string, count = 5): Promise<string[]> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.decoding = "async";
  img.src = url;
  await img.decode();
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;
  const buckets = new Map<number, { n: number; r: number; g: number; b: number }>();
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (data[i + 3] < 200) continue;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max < 28 || min > 235 || max - min < 18) continue; // skip black/white/grey
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const e = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    e.n++;
    e.r += r;
    e.g += g;
    e.b += b;
    buckets.set(key, e);
  }
  const hex = (x: number) => Math.round(x).toString(16).padStart(2, "0");
  return [...buckets.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, count)
    .map((e) => `#${hex(e.r / e.n)}${hex(e.g / e.n)}${hex(e.b / e.n)}`);
}
