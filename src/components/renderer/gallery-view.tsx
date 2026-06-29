"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Img = { url: string; alt?: string };

export function GalleryView({
  images,
  layout = "grid",
  box,
  frame,
  img,
}: {
  images: Img[];
  layout?: "grid" | "carousel";
  box: string;
  frame: string;
  img: string;
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const count = images.length;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  // Autoplay for the carousel; pauses while the lightbox is open.
  useEffect(() => {
    if (layout !== "carousel" || count < 2 || lightbox !== null) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 4000);
    return () => clearInterval(t);
  }, [layout, count, lightbox]);

  // Keyboard nav for the lightbox.
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % count));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + count) % count));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, count]);

  if (count === 0) return null;

  const Lightbox =
    lightbox !== null ? (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        onClick={() => setLightbox(null)}
      >
        <button
          aria-label="Close"
          className="absolute right-4 top-4 text-white/80 hover:text-white"
          onClick={() => setLightbox(null)}
        >
          <X className="h-7 w-7" />
        </button>
        {count > 1 && (
          <>
            <button
              aria-label="Previous"
              className="absolute left-3 text-white/80 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((i) => (i === null ? i : (i - 1 + count) % count));
              }}
            >
              <ChevronLeft className="h-9 w-9" />
            </button>
            <button
              aria-label="Next"
              className="absolute right-3 text-white/80 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((i) => (i === null ? i : (i + 1) % count));
              }}
            >
              <ChevronRight className="h-9 w-9" />
            </button>
          </>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[lightbox].url}
          alt={images[lightbox].alt ?? ""}
          className="max-h-[88vh] max-w-full rounded-xl object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    ) : null;

  if (layout === "carousel") {
    return (
      <div>
        <div className={cn("relative border border-border", box)}>
          <div className={frame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[index].url}
              alt={images[index].alt ?? ""}
              className={cn(img, "cursor-zoom-in")}
              onClick={() => setLightbox(index)}
            />
          </div>
          {count > 1 && (
            <>
              <button
                aria-label="Previous"
                onClick={() => go(-1)}
                className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/70"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                aria-label="Next"
                onClick={() => go(1)}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/70"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
        {count > 1 && (
          <div className="mt-2.5 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to image ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-5 bg-primary" : "w-1.5 bg-border hover:bg-text-muted",
                )}
              />
            ))}
          </div>
        )}
        {Lightbox}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {images.map((image, i) => (
        <button
          key={i}
          onClick={() => setLightbox(i)}
          className={cn("group cursor-zoom-in border border-border", box)}
        >
          <div className={frame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.alt ?? ""}
              className={cn(img, "transition-transform duration-300 group-hover:scale-105")}
            />
          </div>
        </button>
      ))}
      {Lightbox}
    </div>
  );
}
