"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, Download, ExternalLink, PartyPopper, Share2, Sparkles, X } from "lucide-react";
import { SocialIcon } from "@/lib/socials";
import { cn } from "@/lib/utils";

/**
 * Shown after a successful publish: the live link, a QR code and share
 * shortcuts — or, when the plan's page limit keeps this page offline, why.
 */
export function PublishDialog({ url, overLimit = null, onClose }: { url: string; overLimit?: number | null; onClose: () => void }) {
  const [qr, setQr] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const pretty = url.replace(/^https?:\/\//, "");

  useEffect(() => {
    let alive = true;
    // QR encoder is only fetched when someone actually publishes.
    import("qrcode")
      .then((m) => m.toDataURL(url, { margin: 1, width: 480, color: { dark: "#0b0c10", light: "#ffffff" } }))
      .then((d) => alive && setQr(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [url]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("העתיקו את הקישור:", url);
    }
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ url, title: "העמוד שלי" }).catch(() => {});
    } else copy();
  };

  const text = encodeURIComponent(`הנה העמוד שלי ✨ ${url}`);
  const targets = [
    { name: "WhatsApp", icon: "whatsapp" as const, href: `https://wa.me/?text=${text}` },
    { name: "X", icon: "x" as const, href: `https://x.com/intent/tweet?text=${text}` },
    { name: "Facebook", icon: "facebook" as const, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: "Telegram", icon: "telegram" as const, href: `https://t.me/share/url?url=${encodeURIComponent(url)}` },
  ];

  if (overLimit !== null) {
    return (
      <div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="publish-pop relative w-full max-w-sm rounded-xl border border-border bg-bg p-6 text-center shadow-2xl"
        >
          <button onClick={onClose} aria-label="סגירה" className="absolute top-4 end-4 text-text-muted hover:text-text">
            <X className="h-5 w-5" />
          </button>
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-primary/15 text-primary-text">
            <Sparkles className="h-6 w-6" />
          </span>
          <h2 className="mt-3 font-display text-xl font-medium">נשמר — אבל עוד לא באוויר</h2>
          <p className="mt-1 text-sm text-text-muted">
            {overLimit === 1 ? "החבילה שלכם מאפשרת עמוד אחד באוויר" : `החבילה שלכם מאפשרת ${overLimit} עמודים באוויר`}, וכולם
            בשימוש. שדרגו, או הורידו עמוד אחר מהאוויר מהעורך שלו, והעמוד הזה יעלה ל־<span dir="ltr">{pretty}</span>.
          </p>
          <Link
            href="/dashboard/upgrade"
            className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-ink"
          >
            לחבילות
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="publish-pop relative w-full max-w-sm overflow-hidden rounded-xl border border-border bg-bg p-6 text-center shadow-2xl"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 h-48 opacity-40"
          style={{ background: "radial-gradient(50% 60% at 50% 100%, var(--primary), transparent 70%)" }}
        />
        <button onClick={onClose} aria-label="סגירה" className="absolute top-4 end-4 text-text-muted hover:text-text">
          <X className="h-5 w-5" />
        </button>
        <span className="relative mx-auto grid h-12 w-12 place-items-center rounded-lg bg-primary/15 text-primary-text">
          <PartyPopper className="h-6 w-6" />
        </span>
        <h2 className="relative mt-3 font-display text-xl font-medium">אתם באוויר!</h2>
        <p className="relative mt-1 text-sm text-text-muted">שתפו בכל מקום — ביו, סטורי, חתימה במייל.</p>

        <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-surface-2 p-1.5 ps-3">
          <span className="min-w-0 flex-1 truncate text-start text-sm text-text">{pretty}</span>
          <button
            onClick={copy}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors",
              copied ? "bg-primary/15 text-primary-text" : "bg-primary text-primary-ink",
            )}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "הועתק" : "העתקה"}
          </button>
        </div>

        <div className="mx-auto mt-5 w-40 overflow-hidden rounded-lg bg-white p-2">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt={`קוד QR עבור ${pretty}`} className="aspect-square w-full" />
          ) : (
            <span className="block aspect-square w-full animate-pulse rounded-xl bg-neutral-200" />
          )}
        </div>
        {qr && (
          <a href={qr} download="aura-qr.png" className="mt-2 inline-flex items-center gap-1 text-xs text-text-muted hover:text-text">
            <Download className="h-3.5 w-3.5" /> הורדת QR להדפסה
          </a>
        )}

        <div className="mt-5 grid grid-cols-5 gap-2">
          {targets.map((t) => (
            <a
              key={t.name}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`שיתוף ב־${t.name}`}
              className="grid h-11 place-items-center rounded-xl border border-border bg-surface-2 text-text transition-colors hover:border-primary/50"
            >
              <SocialIcon platform={t.icon} className="h-4 w-4" />
            </a>
          ))}
          <button
            onClick={share}
            aria-label="אפשרויות שיתוף נוספות"
            className="grid h-11 place-items-center rounded-xl border border-border bg-surface-2 text-text transition-colors hover:border-primary/50"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border text-sm text-text transition-colors hover:bg-surface-2"
        >
          <ExternalLink className="h-4 w-4" /> לעמוד שלי
        </a>
      </div>
    </div>
  );
}
