"use client";

// The page editor: form panels on one side, a live preview on the other.
// Everything edits local state; "שמירה" persists via the saveSite action.
import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Check, Lock, Save, Sparkles } from "lucide-react";
import { saveSite } from "@/lib/actions/site";
import type { SiteContent } from "@/lib/content";
import {
  ACCENTS,
  BACKGROUNDS,
  BUTTON_FILLS,
  BUTTON_SHAPES,
  CORNERS,
  EFFECTS,
  FONTS,
  THEMES,
  applyTheme,
  background,
  type SiteDesign,
} from "@/lib/design";
import { caps, type Plan } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { Input, Label, Textarea } from "@/components/ui";
import { SiteRenderer, type RenderHour, type RenderService } from "@/components/site-renderer";
import { PublishToggle } from "@/components/dashboard-bits";

type Props = {
  businessName: string;
  slug: string;
  plan: Plan;
  bookingEnabled: boolean;
  published: boolean;
  initialContent: SiteContent;
  initialDesign: SiteDesign;
  services: RenderService[];
  hours: RenderHour[];
};

export function Editor(props: Props) {
  const [tab, setTab] = useState<"content" | "design">("design");
  const [content, setContent] = useState(props.initialContent);
  const [design, setDesign] = useState(props.initialDesign);
  const [saved, setSaved] = useState(true);
  const [pending, startTransition] = useTransition();

  const setC = <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => {
    setContent((p) => ({ ...p, [k]: v }));
    setSaved(false);
  };
  const setD = <K extends keyof SiteDesign>(k: K, v: SiteDesign[K]) => {
    setDesign((p) => ({ ...p, [k]: v, ...(k !== "theme" ? { theme: "" } : {}) }));
    setSaved(false);
  };

  const save = () =>
    startTransition(async () => {
      await saveSite({ content, design });
      setSaved(true);
    });

  const preview = useMemo(
    () => (
      <SiteRenderer
        businessName={props.businessName}
        slug={props.slug}
        content={content}
        design={design}
        services={props.services}
        hours={props.hours}
        bookingEnabled={props.bookingEnabled}
        preview
      />
    ),
    [props, content, design],
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-xl bg-night-2 p-1">
          {(
            [
              ["design", "עיצוב"],
              ["content", "תוכן"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-semibold transition cursor-pointer",
                tab === id ? "bg-halo text-night" : "text-ink-2 hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={save}
            disabled={pending || saved}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition cursor-pointer",
              saved ? "bg-white/5 text-ink-2" : "bg-halo text-night hover:bg-halo-2",
            )}
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {pending ? "שומרים…" : saved ? "נשמר" : "שמירה"}
          </button>
          <PublishToggle published={props.published} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        {/* ── panel ── */}
        <div className="thin-scroll flex max-h-[75vh] flex-col gap-5 overflow-y-auto pe-1 lg:sticky lg:top-6">
          {tab === "content" ? (
            <ContentPanel content={content} setC={setC} bookingEnabled={props.bookingEnabled} />
          ) : (
            <DesignPanel design={design} setDesign={(d) => { setDesign(d); setSaved(false); }} setD={setD} plan={props.plan} />
          )}
          {props.plan === "FREE" && (
            <Link
              href="/dashboard/plan"
              className="flex items-center gap-3 rounded-xl border border-halo/30 bg-halo/8 px-4 py-3 text-sm"
            >
              <Sparkles className="h-5 w-5 shrink-0 text-halo" />
              <span>
                <b className="text-halo">רוצים את כל אפשרויות העיצוב?</b>{" "}
                שדרוג לחבילת עיצוב — ₪9.90/חודש
              </span>
            </Link>
          )}
        </div>

        {/* ── live preview ── */}
        <div className="overflow-hidden rounded-2xl border border-line bg-night-2">
          <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            <span className="ms-3 text-xs text-ink-2" dir="ltr">/{props.slug}</span>
          </div>
          <div className="max-h-[70vh] overflow-y-auto thin-scroll">{preview}</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── content panel ─────────────────────────── */

const EMOJI = ["✨", "💇", "💅", "🧖", "💆", "🦷", "👨‍⚕️", "🧠", "🏋️", "🧘", "📸", "🎨", "🍰", "☕", "🐶", "🚗", "🔧", "🏠", "⚖️", "📚", "🎓", "💼"];

function ContentPanel({
  content,
  setC,
  bookingEnabled,
}: {
  content: SiteContent;
  setC: <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => void;
  bookingEnabled: boolean;
}) {
  return (
    <>
      <Section title="כרטיס העסק">
        <Label>אייקון</Label>
        <div className="flex flex-wrap gap-1.5">
          {EMOJI.map((e) => (
            <button
              key={e}
              onClick={() => setC("emoji", e)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg text-xl transition cursor-pointer",
                content.emoji === e ? "bg-halo/20 ring-2 ring-halo" : "bg-night-3 hover:bg-white/10",
              )}
            >
              {e}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <Label htmlFor="tagline">משפט פתיחה</Label>
          <Input
            id="tagline"
            value={content.tagline}
            onChange={(e) => setC("tagline", e.target.value)}
            placeholder="מספרה בוטיק בלב תל אביב"
            maxLength={90}
          />
        </div>
        <div className="mt-3">
          <Label htmlFor="about">על העסק</Label>
          <Textarea
            id="about"
            rows={4}
            value={content.about}
            onChange={(e) => setC("about", e.target.value)}
            placeholder="ספרו ללקוחות מי אתם, מה אתם מציעים ולמה כדאי להגיע דווקא אליכם…"
            maxLength={600}
          />
        </div>
      </Section>

      <Section title="פרטי קשר">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="phone">טלפון</Label>
            <Input id="phone" dir="ltr" value={content.phone} onChange={(e) => setC("phone", e.target.value)} placeholder="03-1234567" />
          </div>
          <div>
            <Label htmlFor="whatsapp">וואטסאפ</Label>
            <Input id="whatsapp" dir="ltr" value={content.whatsapp} onChange={(e) => setC("whatsapp", e.target.value)} placeholder="050-1234567" />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="instagram">אינסטגרם</Label>
            <Input id="instagram" dir="ltr" value={content.instagram} onChange={(e) => setC("instagram", e.target.value)} placeholder="my.business" />
          </div>
          <div>
            <Label htmlFor="facebook">פייסבוק</Label>
            <Input id="facebook" dir="ltr" value={content.facebook} onChange={(e) => setC("facebook", e.target.value)} placeholder="facebook.com/…" />
          </div>
        </div>
        <div className="mt-3">
          <Label htmlFor="address">כתובת</Label>
          <Input id="address" value={content.address} onChange={(e) => setC("address", e.target.value)} placeholder="דיזנגוף 100, תל אביב" />
        </div>
      </Section>

      <Section title="מה מציגים בעמוד">
        {bookingEnabled && (
          <div className="mb-3">
            <Label htmlFor="ctaText">טקסט כפתור הזימון</Label>
            <Input id="ctaText" value={content.ctaText} onChange={(e) => setC("ctaText", e.target.value)} maxLength={30} />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Toggle label="אזור «על העסק»" checked={content.showAbout} onChange={(v) => setC("showAbout", v)} />
          <Toggle label="רשימת השירותים" checked={content.showServices} onChange={(v) => setC("showServices", v)} />
          <Toggle label="שעות פעילות" checked={content.showHours} onChange={(v) => setC("showHours", v)} />
        </div>
      </Section>
    </>
  );
}

/* ─────────────────────────── design panel ─────────────────────────── */

function DesignPanel({
  design,
  setDesign,
  setD,
  plan,
}: {
  design: SiteDesign;
  setDesign: (d: SiteDesign) => void;
  setD: <K extends keyof SiteDesign>(k: K, v: SiteDesign[K]) => void;
  plan: Plan;
}) {
  const c = caps(plan);
  return (
    <>
      <Section title="ערכות בלחיצה אחת">
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((t) => {
            const locked = !c.allThemes && !t.free;
            const bg = background(t.design.background);
            return (
              <button
                key={t.id}
                onClick={() => !locked && setDesign(applyTheme(t))}
                className={cn(
                  "relative overflow-hidden rounded-xl border p-3 text-start transition cursor-pointer",
                  design.theme === t.id ? "border-halo ring-2 ring-halo/40" : "border-line hover:border-white/25",
                  locked && "opacity-60",
                )}
              >
                <div className="h-10 rounded-lg" style={{ background: bg.css }}>
                  <div className="flex h-full items-center justify-center">
                    <span
                      className="h-3 w-12 rounded-full"
                      style={{ background: t.design.accent, borderRadius: t.design.button === "sharp" ? 2 : 999 }}
                    />
                  </div>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold">
                  {locked && <Lock className="h-3 w-3 text-halo" />}
                  {t.name}
                </p>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="רקע">
        <div className="grid grid-cols-4 gap-2">
          {BACKGROUNDS.map((b) => {
            const locked = !c.allBackgrounds && !b.free;
            return (
              <button
                key={b.id}
                title={b.name}
                onClick={() => !locked && setD("background", b.id)}
                className={cn(
                  "relative h-14 overflow-hidden rounded-lg border transition cursor-pointer",
                  design.background === b.id ? "border-halo ring-2 ring-halo/40" : "border-line hover:border-white/25",
                  locked && "opacity-50",
                )}
                style={{ background: b.css }}
              >
                {(b.animated || b.halo) && (
                  <span className="absolute start-1 top-1 rounded bg-black/40 px-1 text-[9px] text-white">חי</span>
                )}
                {locked && <Lock className="absolute bottom-1 end-1 h-3.5 w-3.5 text-white drop-shadow" />}
                <span className="absolute inset-x-0 bottom-0 bg-black/45 px-1 py-0.5 text-center text-[9px] text-white">
                  {b.name}
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="צבע מוביל">
        <div className="flex flex-wrap gap-2">
          {ACCENTS.map((a) => (
            <button
              key={a}
              onClick={() => setD("accent", a)}
              className={cn(
                "h-8 w-8 rounded-full transition cursor-pointer",
                design.accent === a && "ring-2 ring-white ring-offset-2 ring-offset-night",
              )}
              style={{ background: a }}
            />
          ))}
          <label className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-full border border-line bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)]">
            <input
              type="color"
              value={design.accent}
              onChange={(e) => setD("accent", e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
        </div>
      </Section>

      <Section title="פונט">
        <div className="flex flex-col gap-1.5">
          {FONTS.map((f) => {
            const locked = !c.allFonts && !f.free;
            return (
              <button
                key={f.id}
                onClick={() => !locked && setD("font", f.id)}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition cursor-pointer",
                  design.font === f.id ? "border-halo bg-halo/10" : "border-line hover:border-white/25",
                  locked && "opacity-50",
                )}
                style={{ fontFamily: `var(${f.variable})` }}
              >
                <span>{f.name}</span>
                {locked ? <Lock className="h-3.5 w-3.5 text-halo" /> : <span className="text-xs text-ink-2">אב</span>}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="כפתורים">
        <Label>צורה</Label>
        <Chips
          options={BUTTON_SHAPES.map((b) => ({ id: b.id, name: b.name, locked: !c.allButtons && !("free" in b && b.free) }))}
          value={design.button}
          onPick={(v) => setD("button", v)}
        />
        <Label className="mt-3">מילוי</Label>
        <Chips
          options={BUTTON_FILLS.map((b) => ({ id: b.id, name: b.name, locked: !c.allButtons && !("free" in b && b.free) }))}
          value={design.buttonFill}
          onPick={(v) => setD("buttonFill", v)}
        />
      </Section>

      <Section title="פינות ואפקטים">
        <Label>עיגול פינות</Label>
        <Chips
          options={CORNERS.map((x) => ({ id: x.id, name: x.name, locked: false }))}
          value={design.corners}
          onPick={(v) => setD("corners", v)}
        />
        <Label className="mt-3">אפקט כניסה</Label>
        <Chips
          options={EFFECTS.map((e) => ({ id: e.id, name: e.name, locked: !c.effects && !("free" in e && e.free) }))}
          value={design.effects}
          onPick={(v) => setD("effects", v)}
        />
      </Section>
    </>
  );
}

/* ─────────────────────────── tiny primitives ─────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      <h3 className="mb-3 text-sm font-bold text-ink">{title}</h3>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5 text-sm cursor-pointer hover:border-white/25"
    >
      <span>{label}</span>
      <span
        className={cn(
          "relative h-5 w-9 rounded-full transition",
          checked ? "bg-halo" : "bg-white/15",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all",
            checked ? "start-4" : "start-0.5",
          )}
        />
      </span>
    </button>
  );
}

function Chips({
  options,
  value,
  onPick,
}: {
  options: { id: string; name: string; locked: boolean }[];
  value: string;
  onPick: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => !o.locked && onPick(o.id)}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition cursor-pointer",
            value === o.id ? "border-halo bg-halo/15 text-halo" : "border-line text-ink-2 hover:border-white/25",
            o.locked && "opacity-50",
          )}
        >
          {o.locked && <Lock className="h-3 w-3" />}
          {o.name}
        </button>
      ))}
    </div>
  );
}
