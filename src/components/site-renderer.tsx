// Renders a business page from its content + design JSON.
// Used by the public page (/[slug]) AND the editor's live preview, so it must
// stay a pure presentational component (no data fetching).
import type { CSSProperties } from "react";
import {
  Phone,
  MapPin,
  Camera,
  ThumbsUp,
  Clock,
  MessageCircle,
} from "lucide-react";
import { designStyle, type SiteDesign } from "@/lib/design";
import type { SiteContent } from "@/lib/content";
import { minToTime, DAY_NAMES, formatPrice } from "@/lib/utils";

export type RenderService = {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  price: number | null;
};

export type RenderHour = { day: number; startMin: number; endMin: number };

export function SiteRenderer({
  businessName,
  slug,
  content,
  design,
  services,
  hours,
  bookingEnabled,
  preview = false,
}: {
  businessName: string;
  slug: string;
  content: SiteContent;
  design: SiteDesign;
  services: RenderService[];
  hours: RenderHour[];
  bookingEnabled: boolean;
  preview?: boolean;
}) {
  const { bg, vars, dark } = designStyle(design);
  const fx =
    design.effects === "fade" ? "fx-fade" : design.effects === "rise" ? "fx-rise" : "";

  const contacts = [
    content.phone && {
      icon: Phone,
      label: "התקשרו",
      href: `tel:${content.phone}`,
    },
    content.whatsapp && {
      icon: MessageCircle,
      label: "וואטסאפ",
      href: `https://wa.me/972${content.whatsapp.replace(/[^\d]/g, "").replace(/^0/, "")}`,
    },
    content.instagram && {
      icon: Camera,
      label: "אינסטגרם",
      href: `https://instagram.com/${content.instagram.replace(/^@/, "")}`,
    },
    content.facebook && {
      icon: ThumbsUp,
      label: "פייסבוק",
      href: content.facebook.startsWith("http") ? content.facebook : `https://${content.facebook}`,
    },
  ].filter(Boolean) as { icon: typeof Phone; label: string; href: string }[];

  const sortedHours = [...hours].sort((a, b) => a.day - b.day);

  return (
    <div className="site-scope relative min-h-full overflow-hidden" style={vars as CSSProperties} dir="rtl">
      {bg.animated && <div className="bg-animated absolute inset-0" style={{ background: bg.css }} />}
      {bg.halo && (
        <div className="pointer-events-none absolute inset-0">
          <div className="halo-orb right-[10%] top-[6%] h-64 w-64" style={{ background: "var(--site-accent)" }} />
          <div
            className="halo-orb left-[8%] top-[38%] h-72 w-72"
            style={{ background: dark ? "#8b7cf6" : "#f9a8d4", animationDelay: "-7s" }}
          />
        </div>
      )}

      <div className={`relative mx-auto flex max-w-lg flex-col gap-5 px-5 pb-14 pt-12 ${fx}`}>
        {/* hero */}
        <div className="text-center">
          <div className="relative mx-auto mb-4 h-24 w-24">
            {design.effects === "halo" && (
              <div
                className="fx-halo-pulse absolute -inset-4 rounded-full"
                style={{
                  background: "radial-gradient(circle, var(--site-accent) 0%, transparent 68%)",
                  opacity: 0.4,
                }}
              />
            )}
            <div
              className="relative flex h-24 w-24 items-center justify-center rounded-full text-5xl"
              style={{
                background: "var(--site-surface)",
                border: "1px solid var(--site-border)",
              }}
            >
              {content.emoji || "✨"}
            </div>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight">{businessName}</h1>
          {content.tagline && (
            <p className="mt-2 text-base" style={{ color: "var(--site-muted)" }}>
              {content.tagline}
            </p>
          )}
        </div>

        {/* booking CTA */}
        {bookingEnabled && (
          <a
            href={preview ? undefined : `/${slug}/book`}
            className={`site-btn site-btn-${design.buttonFill} block px-6 py-4 text-center text-lg`}
            {...(preview ? { role: "button", "aria-disabled": true } : {})}
          >
            {content.ctaText || "לקביעת תור"} ←
          </a>
        )}

        {/* about */}
        {content.showAbout && content.about && (
          <div className="site-card px-5 py-4">
            <p className="whitespace-pre-line leading-relaxed">{content.about}</p>
          </div>
        )}

        {/* services */}
        {content.showServices && services.length > 0 && (
          <div className="site-card px-5 py-4">
            <h2 className="mb-3 text-lg font-bold">השירותים שלנו</h2>
            <ul className="flex flex-col divide-y" style={{ borderColor: "var(--site-border)" }}>
              {services.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2.5" style={{ borderColor: "var(--site-border)" }}>
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-sm" style={{ color: "var(--site-muted)" }}>
                      {s.durationMin} דק׳{s.description ? ` · ${s.description}` : ""}
                    </p>
                  </div>
                  {s.price != null && (
                    <span className="shrink-0 font-bold" style={{ color: "var(--site-accent)" }}>
                      {formatPrice(s.price)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* opening hours */}
        {content.showHours && sortedHours.length > 0 && (
          <div className="site-card px-5 py-4">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <Clock className="h-5 w-5" style={{ color: "var(--site-accent)" }} />
              שעות פעילות
            </h2>
            <ul className="flex flex-col gap-1.5 text-sm">
              {sortedHours.map((h) => (
                <li key={h.day} className="flex justify-between">
                  <span>{DAY_NAMES[h.day]}</span>
                  <span dir="ltr" style={{ color: "var(--site-muted)" }}>
                    {minToTime(h.startMin)}–{minToTime(h.endMin)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* contact buttons */}
        {contacts.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {contacts.map((c) => (
              <a
                key={c.label}
                href={preview ? undefined : c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`site-btn site-btn-${design.buttonFill === "solid" || design.buttonFill === "glow" ? "soft" : design.buttonFill} flex items-center justify-center gap-2 px-4 py-3 text-sm`}
              >
                <c.icon className="h-4 w-4" />
                {c.label}
              </a>
            ))}
          </div>
        )}

        {/* address */}
        {content.address && (
          <a
            href={preview ? undefined : `https://waze.com/ul?q=${encodeURIComponent(content.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="site-card flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium"
          >
            <MapPin className="h-4 w-4" style={{ color: "var(--site-accent)" }} />
            {content.address}
          </a>
        )}

        {/* badge */}
        <a
          href={preview ? undefined : "/"}
          className="mt-4 text-center text-xs opacity-60 transition hover:opacity-100"
          style={{ color: "var(--site-muted)" }}
        >
          נוצר עם הילה ✨
        </a>
      </div>
    </div>
  );
}
