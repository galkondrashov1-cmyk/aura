"use client";

import { useState } from "react";
import { Image as ImageIcon, Star } from "lucide-react";
import { BLOCK_META } from "./block-meta";
import { cn } from "@/lib/utils";
import type { Block, BlockOf, BlockType, DayHours, LinkItem, SocialPlatform } from "@/lib/blocks";
import { AVATAR_IDLE, BUTTON_FX, BUTTON_IDLE, ICON_FX, ICON_IDLE } from "@/lib/design";
import { SIZE_OPTS, ASPECT_OPTS, RADIUS_OPTS, type ImageConfig } from "@/lib/image";
import { SOCIAL_OPTIONS, SocialIcon, platformFromUrl } from "@/lib/socials";
import { caps, type Plan } from "@/lib/plans";
import { AVATAR_FRAMES, AVATAR_SHAPES, HERO_LAYOUTS, REVEALS, SECTION_STYLES, BLOCK_TIER } from "@/lib/studio";
import { toPlain } from "@/lib/richtext";
import { TYPE_COLORS, TYPE_CURSORS, TYPE_FX, TYPE_SPEEDS, type Typing, type TypeFxId } from "@/lib/typing";
import { RichTextInput } from "./rich-text-input";
import { AddItem, Chips, ColorField, ImageField, ItemCard, Label, Section, Seg, Slider, Toggle, TierPill, fieldCls } from "./ui";

export function newBlock(type: BlockType): Block {
  const id = crypto.randomUUID();
  switch (type) {
    case "hero":
      return { id, type, name: "השם שלכם", tagline: "" };
    case "links":
      return { id, type, items: [{ label: "קישור חדש", url: "https://", icon: "auto" }] };
    case "text":
      return { id, type, heading: "כותרת", body: "קצת טקסט…" };
    case "socials":
      return { id, type, items: [{ platform: "instagram", url: "https://" }] };
    case "image":
      return { id, type, url: "", alt: "" };
    case "gallery":
      return { id, type, images: [] };
    case "video":
      return { id, type, url: "", title: "" };
    case "faq":
      return { id, type, items: [{ question: "שאלה?", answer: "תשובה." }] };
    case "divider":
      return { id, type };
    case "embed":
      return { id, type, url: "" };
    case "music":
      return { id, type, url: "" };
    case "countdown":
      return { id, type, target: "", label: "" };
    case "marquee":
      return { id, type, text: "ההודעה שלכם כאן", style: "band", speed: "normal" };
    case "features":
      return {
        id,
        type,
        heading: "מה אני מציע/ה",
        cols: 2,
        items: [
          { icon: "✨", title: "דבר ראשון", text: "שורה קצרה עליו." },
          { icon: "⚡", title: "דבר שני", text: "שורה קצרה עליו." },
        ],
      };
    case "testimonials":
      return { id, type, heading: "מה אומרים עליי", items: [{ quote: "פשוט תענוג לעבוד ביחד.", name: "לקוחה מרוצה", rating: 5 }] };
    case "stats":
      return { id, type, items: [{ value: "120+", label: "לקוחות" }, { value: "4.9", label: "דירוג" }, { value: "8", label: "שנים" }] };
    case "pricing":
      return {
        id,
        type,
        heading: "מחירון",
        items: [{ name: "בסיסי", price: "₪99", period: "/חודש", features: "דבר אחד\nעוד דבר", cta: "להתחיל", url: "https://" }],
      };
    case "form":
      return { id, type, kind: "newsletter", heading: "הישארו מעודכנים", text: "עדכונים מדי פעם, בלי ספאם.", button: "הצטרפות" };
    case "map":
      return { id, type, query: "", height: "md" };
    case "spacer":
      return { id, type, size: "md" };
    case "hours": {
      const day = { from: "09:00", to: "18:00" };
      return { id, type, heading: "שעות פתיחה", days: [day, day, day, day, day, { from: "09:00", to: "13:00" }, { closed: true }] };
    }
    case "contact":
      return { id, type, name: "השם שלכם", role: "", phone: "", email: "" };
  }
}

/** One-line summary for the outline list. */
export function blockSummary(b: Block): string {
  switch (b.type) {
    case "hero":
      return toPlain(b.name);
    case "links":
      return b.items.map((l) => toPlain(l.label)).join(" · ");
    case "text":
      return toPlain(b.heading) || toPlain(b.body);
    case "socials":
      return b.items.map((s) => s.platform).join(", ");
    case "features":
    case "testimonials":
    case "pricing":
      return b.heading ?? `${b.items.length} פריטים`;
    case "stats":
      return b.items.map((s) => s.value).join(" · ");
    case "marquee":
      return b.text;
    case "form":
      return b.heading ?? b.kind;
    case "map":
      return b.query;
    case "faq":
      return `${b.items.length} שאלות`;
    case "gallery":
      return `${b.images.length} תמונות`;
    case "hours":
      return b.heading ?? "";
    case "contact":
      return b.name;
    default:
      return "";
  }
}

type Patch = (p: Record<string, unknown>) => void;

export function BlockFields({ block, plan, onPatch }: { block: Block; plan: Plan; onPatch: Patch }) {
  return (
    <div className="space-y-5">
      <Fields block={block} plan={plan} onPatch={onPatch} />
      <BlockStyle block={block} plan={plan} onPatch={onPatch} />
    </div>
  );
}

function Fields({ block, plan, onPatch }: { block: Block; plan: Plan; onPatch: Patch }) {
  const c = caps(plan);
  switch (block.type) {
    case "hero":
      return <HeroEditor b={block} plan={plan} onPatch={onPatch} />;
    case "links":
      return <LinksEditor b={block} plan={plan} onPatch={onPatch} />;
    case "text":
      return <TextEditor b={block} plan={plan} onPatch={onPatch} />;
    case "socials":
      return <SocialsEditor b={block} plan={plan} onPatch={onPatch} />;
    case "image":
      return (
        <div className="space-y-3">
          <ImageField value={block.url} onChange={(url) => onPatch({ url: url ?? "" })} />
          <input value={block.alt ?? ""} onChange={(e) => onPatch({ alt: e.target.value })} placeholder="תיאור התמונה (לקוראי מסך)" className={fieldCls} />
          <RichTextInput value={block.caption} onChange={(caption) => onPatch({ caption })} placeholder="כיתוב (רשות)" />
          <ImageControls value={block.img} onChange={(img) => onPatch({ img })} />
        </div>
      );
    case "gallery":
      return (
        <div className="space-y-3">
          <Seg
            value={block.layout ?? "grid"}
            options={[
              { id: "grid", label: "רשת" },
              { id: "masonry", label: "פסיפס" },
              { id: "carousel", label: <>מצגת {!c.gallerySlideshow && <TierPill tier="PLUS" />}</> },
            ]}
            onChange={(layout) => onPatch({ layout })}
          />
          {block.layout !== "masonry" && (
            <ImageControls value={block.img} onChange={(img) => onPatch({ img })} showSize={false} defaults={{ aspect: "square", radius: "sm" }} />
          )}
          {block.images.map((im, i) => (
            <ItemCard key={i} onRemove={() => onPatch({ images: block.images.filter((_, j) => j !== i) })}>
              <div className="pe-8">
                <ImageField value={im.url} onChange={(url) => onPatch({ images: block.images.map((x, j) => (j === i ? { ...x, url: url ?? "" } : x)) })} />
              </div>
            </ItemCard>
          ))}
          <AddItem label="הוספת תמונה" onClick={() => onPatch({ images: [...block.images, { url: "" }] })} />
        </div>
      );
    case "video":
      return (
        <div className="space-y-2">
          <input value={block.url} onChange={(e) => onPatch({ url: e.target.value })} placeholder="קישור ל־YouTube או Vimeo" className={fieldCls} />
          <RichTextInput value={block.title} onChange={(title) => onPatch({ title })} placeholder="כותרת (רשות)" />
          <p className="text-[11px] text-text-muted">נטען מיד — הנגן יורד רק כשהמבקר לוחץ על נגן.</p>
        </div>
      );
    case "faq":
      return (
        <div className="space-y-2">
          <Seg value={block.align ?? "left"} options={ALIGNS} onChange={(align) => onPatch({ align })} />
          {block.items.map((it, i) => (
            <ItemCard key={i} onRemove={() => onPatch({ items: block.items.filter((_, j) => j !== i) })}>
              <div className="pe-8">
                <RichTextInput value={it.question} onChange={(question) => onPatch({ items: block.items.map((x, j) => (j === i ? { ...x, question } : x)) })} placeholder="שאלה" />
              </div>
              <RichTextInput value={it.answer} multiline onChange={(answer) => onPatch({ items: block.items.map((x, j) => (j === i ? { ...x, answer } : x)) })} placeholder="תשובה" />
            </ItemCard>
          ))}
          <AddItem label="הוספת שאלה" onClick={() => onPatch({ items: [...block.items, { question: "שאלה?", answer: "תשובה." }] })} />
        </div>
      );
    case "divider":
      return <DividerEditor b={block} plan={plan} onPatch={onPatch} />;
    case "embed":
      return (
        <div className="space-y-2">
          <input value={block.url} onChange={(e) => onPatch({ url: e.target.value })} placeholder="כתובת https להטמעה" className={fieldCls} />
          <Seg value={block.height ?? "md"} options={HEIGHTS} onChange={(height) => onPatch({ height })} />
          <p className="text-[11px] text-text-muted">טפסים, יומנים, מפות, וידג׳טים — כל עמוד https.</p>
        </div>
      );
    case "music":
      return (
        <div className="space-y-2">
          <input value={block.url} onChange={(e) => onPatch({ url: e.target.value })} placeholder="קישור מ־Spotify / SoundCloud / Apple Music" className={fieldCls} />
          <p className="text-[11px] text-text-muted">הדביקו קישור שיתוף — הוא יהפוך לנגן קטן.</p>
        </div>
      );
    case "countdown":
      return (
        <div className="space-y-2">
          <input value={block.label ?? ""} onChange={(e) => onPatch({ label: e.target.value })} placeholder="תווית (למשל: משיקים בעוד…)" className={fieldCls} />
          <input type="datetime-local" value={block.target} onChange={(e) => onPatch({ target: e.target.value })} className={fieldCls} aria-label="תאריך היעד" />
        </div>
      );
    case "marquee":
      return (
        <div className="space-y-3">
          <input value={block.text} onChange={(e) => onPatch({ text: e.target.value })} placeholder="טקסט רץ" maxLength={140} className={fieldCls} />
          <div>
            <Label>סגנון</Label>
            <Seg
              value={block.style ?? "plain"}
              options={[
                { id: "plain", label: "פשוט" },
                { id: "band", label: "פס" },
                { id: "outline", label: "קו מתאר" },
                { id: "tilt", label: "נטוי" },
              ]}
              onChange={(style) => onPatch({ style })}
            />
          </div>
          <div>
            <Label>מהירות</Label>
            <Seg
              value={block.speed ?? "normal"}
              options={[
                { id: "slow", label: "איטי" },
                { id: "normal", label: "רגיל" },
                { id: "fast", label: "מהיר" },
              ]}
              onChange={(speed) => onPatch({ speed })}
            />
          </div>
          <Toggle checked={!!block.reverse} onChange={(reverse) => onPatch({ reverse: reverse || undefined })} label="גלילה לכיוון ההפוך" />
        </div>
      );
    case "features":
      return (
        <div className="space-y-2.5">
          <input value={block.heading ?? ""} onChange={(e) => onPatch({ heading: e.target.value || undefined })} placeholder="כותרת המקטע (רשות)" className={fieldCls} />
          <div>
            <Label>עמודות</Label>
            <Seg
              value={String(block.cols ?? 2)}
              options={[
                { id: "1", label: "1" },
                { id: "2", label: "2" },
                { id: "3", label: "3" },
              ]}
              onChange={(v) => onPatch({ cols: Number(v) })}
            />
          </div>
          {block.items.map((it, i) => {
            const set = (p: Partial<typeof it>) => onPatch({ items: block.items.map((x, j) => (j === i ? { ...x, ...p } : x)) });
            return (
              <ItemCard key={i} onRemove={() => onPatch({ items: block.items.filter((_, j) => j !== i) })}>
                <div className="flex gap-2 pe-8">
                  <EmojiInput value={it.icon} onChange={(icon) => set({ icon })} />
                  <input value={it.title} onChange={(e) => set({ title: e.target.value })} placeholder="כותרת" className={fieldCls} />
                </div>
                <input value={it.text ?? ""} onChange={(e) => set({ text: e.target.value || undefined })} placeholder="תיאור קצר" className={fieldCls} />
              </ItemCard>
            );
          })}
          <AddItem onClick={() => onPatch({ items: [...block.items, { icon: "✦", title: "שירות חדש" }] })} />
        </div>
      );
    case "testimonials":
      return (
        <div className="space-y-2.5">
          <input value={block.heading ?? ""} onChange={(e) => onPatch({ heading: e.target.value || undefined })} placeholder="כותרת המקטע (רשות)" className={fieldCls} />
          <Seg
            value={block.layout ?? "stack"}
            options={[
              { id: "stack", label: "אחד מתחת לשני" },
              { id: "carousel", label: "קרוסלה להחלקה" },
            ]}
            onChange={(layout) => onPatch({ layout })}
          />
          {block.items.map((it, i) => {
            const set = (p: Partial<typeof it>) => onPatch({ items: block.items.map((x, j) => (j === i ? { ...x, ...p } : x)) });
            return (
              <ItemCard key={i} onRemove={() => onPatch({ items: block.items.filter((_, j) => j !== i) })}>
                <textarea value={it.quote} onChange={(e) => set({ quote: e.target.value })} placeholder="מה אמרו" rows={3} className={cn(fieldCls, "h-auto resize-none py-2 pe-8")} />
                <div className="grid grid-cols-2 gap-2">
                  <input value={it.name} onChange={(e) => set({ name: e.target.value })} placeholder="שם" className={fieldCls} />
                  <input value={it.role ?? ""} onChange={(e) => set({ role: e.target.value || undefined })} placeholder="תפקיד / חברה" className={fieldCls} />
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => set({ rating: it.rating === n ? undefined : n })} aria-label={`${n} stars`}>
                      <Star className={cn("h-5 w-5", (it.rating ?? 0) >= n ? "fill-amber-400 text-amber-400" : "text-text-muted")} />
                    </button>
                  ))}
                  <span className="ms-2 text-[11px] text-text-muted">{it.rating ? "" : "בלי כוכבים"}</span>
                </div>
                <ImageField value={it.avatar} onChange={(avatar) => set({ avatar })} placeholder="תמונה (רשות)" maxDim={300} />
              </ItemCard>
            );
          })}
          <AddItem label="הוספת המלצה" onClick={() => onPatch({ items: [...block.items, { quote: "", name: "", rating: 5 }] })} />
        </div>
      );
    case "stats":
      return (
        <div className="space-y-2.5">
          {block.items.map((it, i) => {
            const set = (p: Partial<typeof it>) => onPatch({ items: block.items.map((x, j) => (j === i ? { ...x, ...p } : x)) });
            return (
              <ItemCard key={i} onRemove={() => onPatch({ items: block.items.filter((_, j) => j !== i) })}>
                <div className="grid grid-cols-[6rem_1fr] gap-2 pe-8">
                  <input value={it.value} onChange={(e) => set({ value: e.target.value })} placeholder="120+" className={fieldCls} />
                  <input value={it.label} onChange={(e) => set({ label: e.target.value })} placeholder="תווית" className={fieldCls} />
                </div>
              </ItemCard>
            );
          })}
          {block.items.length < 4 && <AddItem label="הוספת מספר" onClick={() => onPatch({ items: [...block.items, { value: "10", label: "תווית" }] })} />}
          <p className="text-[11px] text-text-muted">המספרים סופרים כשהמבקרים גוללים אליהם. אפשר קידומות וסיומות: ₪4.9M, ‏98%, ‏10K+.</p>
        </div>
      );
    case "pricing":
      return (
        <div className="space-y-2.5">
          <input value={block.heading ?? ""} onChange={(e) => onPatch({ heading: e.target.value || undefined })} placeholder="כותרת המקטע (רשות)" className={fieldCls} />
          {block.items.map((it, i) => {
            const set = (p: Partial<typeof it>) => onPatch({ items: block.items.map((x, j) => (j === i ? { ...x, ...p } : x)) });
            return (
              <ItemCard key={i} onRemove={() => onPatch({ items: block.items.filter((_, j) => j !== i) })}>
                <input value={it.name} onChange={(e) => set({ name: e.target.value })} placeholder="שם החבילה" className={cn(fieldCls, "pe-10")} />
                <div className="grid grid-cols-2 gap-2">
                  <input value={it.price} onChange={(e) => set({ price: e.target.value })} placeholder="₪99" className={fieldCls} />
                  <input value={it.period ?? ""} onChange={(e) => set({ period: e.target.value || undefined })} placeholder="/חודש" className={fieldCls} />
                </div>
                <textarea value={it.features ?? ""} onChange={(e) => set({ features: e.target.value })} placeholder={"יכולת אחת בכל שורה"} rows={3} className={cn(fieldCls, "h-auto resize-none py-2")} />
                <div className="grid grid-cols-2 gap-2">
                  <input value={it.cta ?? ""} onChange={(e) => set({ cta: e.target.value || undefined })} placeholder="טקסט הכפתור" className={fieldCls} />
                  <input value={it.url ?? ""} onChange={(e) => set({ url: e.target.value })} placeholder="קישור הכפתור" className={fieldCls} />
                </div>
                <Toggle checked={!!it.featured} onChange={(featured) => set({ featured: featured || undefined })} label="הדגשה כהכי פופולרי" />
              </ItemCard>
            );
          })}
          {block.items.length < 4 && (
            <AddItem label="הוספת חבילה" onClick={() => onPatch({ items: [...block.items, { name: "חבילה", price: "₪199", period: "/חודש", features: "", cta: "לבחירה", url: "https://" }] })} />
          )}
        </div>
      );
    case "form":
      return (
        <div className="space-y-2.5">
          <Seg
            value={block.kind}
            options={[
              { id: "newsletter", label: "ניוזלטר (מייל)" },
              { id: "contact", label: "יצירת קשר (שם + הודעה)" },
            ]}
            onChange={(kind) => onPatch({ kind })}
          />
          <input value={block.heading ?? ""} onChange={(e) => onPatch({ heading: e.target.value || undefined })} placeholder="כותרת" className={fieldCls} />
          <input value={block.text ?? ""} onChange={(e) => onPatch({ text: e.target.value || undefined })} placeholder="שורה קצרה מתחת לכותרת" className={fieldCls} />
          <div className="grid grid-cols-2 gap-2">
            <input value={block.button ?? ""} onChange={(e) => onPatch({ button: e.target.value || undefined })} placeholder="טקסט הכפתור" className={fieldCls} />
            <input value={block.success ?? ""} onChange={(e) => onPatch({ success: e.target.value || undefined })} placeholder="הודעת תודה" className={fieldCls} />
          </div>
          <p className="rounded-lg bg-surface-2/70 px-3 py-2 text-[11px] text-text-muted">
            הפניות מגיעות ל<span className="text-text">תיבת הפניות</span> בלוח הבקרה — אפשר לייצא ל־CSV בכל רגע.
          </p>
        </div>
      );
    case "map":
      return (
        <div className="space-y-2.5">
          <input value={block.query} onChange={(e) => onPatch({ query: e.target.value })} placeholder="כתובת או שם מקום" className={fieldCls} />
          <Seg value={block.height ?? "md"} options={HEIGHTS} onChange={(height) => onPatch({ height })} />
          <p className="text-[11px] text-text-muted">המבקרים מקבלים ניווט בלחיצה ב־Google Maps או ב־Waze.</p>
        </div>
      );
    case "hours":
      return <HoursEditor b={block} onPatch={onPatch} />;
    case "contact":
      return (
        <div className="space-y-2">
          <input value={block.name} onChange={(e) => onPatch({ name: e.target.value })} placeholder="שם מלא" maxLength={80} className={fieldCls} />
          <div className="grid grid-cols-2 gap-2">
            <input value={block.role ?? ""} onChange={(e) => onPatch({ role: e.target.value })} placeholder="תפקיד" maxLength={80} className={fieldCls} />
            <input value={block.org ?? ""} onChange={(e) => onPatch({ org: e.target.value })} placeholder="עסק / חברה" maxLength={80} className={fieldCls} />
          </div>
          <input dir="ltr" type="tel" value={block.phone ?? ""} onChange={(e) => onPatch({ phone: e.target.value })} placeholder="050-000-0000" maxLength={30} className={cn(fieldCls, "text-end")} />
          <input dir="ltr" type="email" value={block.email ?? ""} onChange={(e) => onPatch({ email: e.target.value })} placeholder="you@email.com" maxLength={120} className={cn(fieldCls, "text-end")} />
          <input dir="ltr" value={block.site ?? ""} onChange={(e) => onPatch({ site: e.target.value })} placeholder="https://" maxLength={200} className={cn(fieldCls, "text-end")} />
          <input value={block.address ?? ""} onChange={(e) => onPatch({ address: e.target.value })} placeholder="כתובת" maxLength={160} className={fieldCls} />
          <p className="text-[11px] text-text-muted">בלחיצה אחת המבקרים שומרים אתכם באנשי הקשר בטלפון, עם קישור לעמוד.</p>
        </div>
      );
    case "spacer":
      return (
        <Seg
          value={block.size ?? "md"}
          options={[
            { id: "sm", label: "S" },
            { id: "md", label: "M" },
            { id: "lg", label: "L" },
            { id: "xl", label: "XL" },
          ]}
          onChange={(size) => onPatch({ size })}
        />
      );
  }
}

// ─────────────────────────── Style (every block) ───────────────────────────

function BlockStyle({ block, plan, onPatch }: { block: Block; plan: Plan; onPatch: Patch }) {
  if (block.type === "spacer") return null;
  return (
    <details className="group rounded-xl border border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-sm text-text-muted select-none">
        עיצוב הבלוק
        <span className="text-[11px] transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="space-y-4 border-t border-border p-3">
        <Section title="מעטפת">
          <Chips
            value={block.box ?? "inherit"}
            plan={plan}
            options={[{ id: "inherit", name: "כמו בעמוד" }, ...SECTION_STYLES]}
            onChange={(box) => onPatch({ box: box === "inherit" ? undefined : box })}
          />
        </Section>
        <Section title="כניסה">
          <Chips
            value={block.anim ?? "inherit"}
            plan={plan}
            cols={4}
            options={[{ id: "inherit", name: "כמו בעמוד" }, ...REVEALS]}
            onChange={(anim) => onPatch({ anim: anim === "inherit" ? undefined : anim })}
          />
        </Section>
      </div>
    </details>
  );
}

// ─────────────────────────── Editors ───────────────────────────

const ALIGNS = [
  { id: "left" as const, label: "התחלה" },
  { id: "center" as const, label: "מרכז" },
  { id: "right" as const, label: "סוף" },
];
const DAY_SHORT = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];

function HoursEditor({ b, onPatch }: { b: BlockOf<"hours">; onPatch: Patch }) {
  const set = (i: number, p: Partial<DayHours>) => onPatch({ days: b.days.map((d, j) => (j === i ? { ...d, ...p } : d)) });
  const time = (i: number, k: keyof DayHours, label: string) => (
    <input
      type="time"
      value={(b.days[i][k] as string | undefined) ?? ""}
      onChange={(e) => set(i, { [k]: e.target.value || undefined })}
      aria-label={`${DAY_SHORT[i]} ${label}`}
      className={cn(fieldCls, "h-9 min-w-0 px-2 text-xs")}
    />
  );
  const mini = "shrink-0 rounded-md border border-border px-2 py-1 text-[11px] text-text-muted hover:text-text";
  return (
    <div className="space-y-3">
      <input value={b.heading ?? ""} onChange={(e) => onPatch({ heading: e.target.value || undefined })} placeholder="כותרת" maxLength={60} className={fieldCls} />
      <div className="space-y-1.5">
        {b.days.map((d, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <span className="w-6 shrink-0 pt-2 text-xs text-text-muted">{DAY_SHORT[i]}</span>
            {d.closed ? (
              <span className="flex h-9 flex-1 items-center text-xs text-text-muted">סגור</span>
            ) : (
              <div dir="ltr" className="grid flex-1 grid-cols-2 gap-1.5">
                {time(i, "from", "פתיחה")}
                {time(i, "to", "סגירה")}
                {(d.from2 || d.to2) && (
                  <>
                    {time(i, "from2", "פתיחה שנייה")}
                    {time(i, "to2", "סגירה שנייה")}
                  </>
                )}
              </div>
            )}
            {!d.closed && (
              <button
                type="button"
                className={cn(mini, "mt-1.5")}
                title="הפסקת צהריים: שני טווחי שעות ביום"
                onClick={() => set(i, d.from2 || d.to2 ? { from2: undefined, to2: undefined } : { from2: "16:00", to2: "19:00" })}
              >
                {d.from2 || d.to2 ? "בלי הפסקה" : "+ הפסקה"}
              </button>
            )}
            <button type="button" className={cn(mini, "mt-1.5")} onClick={() => set(i, { closed: !d.closed || undefined })}>
              {d.closed ? "פתוח" : "סגור"}
            </button>
          </div>
        ))}
      </div>
      <button type="button" className={mini} onClick={() => onPatch({ days: b.days.map((d, j) => (j > 0 && j < 5 ? { ...b.days[0] } : d)) })}>
        להחיל את יום א׳ על א׳–ה׳
      </button>
      <input value={b.note ?? ""} onChange={(e) => onPatch({ note: e.target.value || undefined })} placeholder="הערה (למשל: בערבי חג עד 13:00)" maxLength={140} className={fieldCls} />
      <p className="text-[11px] text-text-muted">לפי שעון ישראל. ימים עם אותן שעות מתאחדים לשורה אחת, והמבקרים רואים אם פתוח עכשיו.</p>
    </div>
  );
}

const HEIGHTS = [
  { id: "sm" as const, label: "נמוך" },
  { id: "md" as const, label: "בינוני" },
  { id: "lg" as const, label: "גבוה" },
];
const EMOJI = ["✨", "⚡", "🔥", "💎", "🚀", "❤️", "🎯", "📅", "📸", "🎵", "🛍️", "💬", "📍", "☕", "🏋️", "🎨"];

function EmojiInput({ value, onChange }: { value?: string; onChange: (v: string | undefined) => void }) {
  return (
    <div className="group relative shrink-0">
      <input
        value={value ?? ""}
        onChange={(e) => onChange(Array.from(e.target.value).slice(-2).join("") || undefined)}
        placeholder="✦"
        className="h-10 w-12 rounded-xl border border-border bg-surface-2 text-center text-lg text-text focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
        aria-label="אייקון (אימוג׳י)"
      />
      <div className="absolute top-11 start-0 z-10 hidden w-56 grid-cols-8 gap-0.5 rounded-xl border border-border bg-bg p-1.5 shadow-2xl group-focus-within:grid">
        {EMOJI.map((e) => (
          <button key={e} type="button" onMouseDown={(ev) => ev.preventDefault()} onClick={() => onChange(e)} className="rounded-md p-1 text-base hover:bg-surface-2">
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

function ImageControls({
  value,
  onChange,
  showSize = true,
  defaults,
}: {
  value?: ImageConfig;
  onChange: (v: ImageConfig) => void;
  showSize?: boolean;
  defaults?: ImageConfig;
}) {
  const v = value ?? {};
  const d = defaults ?? {};
  return (
    <div className="space-y-2 rounded-xl border border-border bg-surface-2/50 p-2.5">
      {showSize && <Seg value={v.size ?? d.size ?? "full"} options={SIZE_OPTS} onChange={(size) => onChange({ ...v, size })} />}
      <Seg value={v.aspect ?? d.aspect ?? "auto"} options={ASPECT_OPTS} onChange={(aspect) => onChange({ ...v, aspect })} />
      <Seg value={v.radius ?? d.radius ?? "md"} options={RADIUS_OPTS} onChange={(radius) => onChange({ ...v, radius })} />
    </div>
  );
}

/** Typewriter 2.0: effect, speed, cursor, color and looping for the header words. */
function TypingFields({ typing = {}, plan, onChange }: { typing?: Typing; plan: Plan; onChange: (t: Typing) => void }) {
  const set = (p: Partial<Typing>) => onChange({ ...typing, ...p });
  const fx = typing.fx ?? "type";
  const keystrokes = fx === "type" || fx === "erase" || fx === "scramble";
  return (
    <Section title="אפקט כתיבה">
      <Chips value={fx} plan={plan} options={TYPE_FX} onChange={(id) => set({ fx: id as TypeFxId })} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>מהירות</Label>
          <Seg value={typing.speed ?? "normal"} options={[...TYPE_SPEEDS]} onChange={(speed) => set({ speed })} />
        </div>
        <div>
          <Label>צבע</Label>
          <Seg value={typing.color ?? "accent"} options={[...TYPE_COLORS]} onChange={(color) => set({ color })} />
        </div>
      </div>
      {keystrokes && (
        <div>
          <Label>סמן</Label>
          <Seg value={typing.cursor ?? "bar"} options={[...TYPE_CURSORS]} onChange={(cursor) => set({ cursor })} />
        </div>
      )}
      <Toggle checked={typing.loop !== false} onChange={(v) => set({ loop: v ? undefined : false })} label="לחזור על המילים בלולאה" />
    </Section>
  );
}

function HeroEditor({ b, plan, onPatch }: { b: BlockOf<"hero">; plan: Plan; onPatch: Patch }) {
  const layout = b.layout ?? "center";
  return (
    <div className="space-y-4">
      <Section title="פריסה">
        <Chips value={layout} plan={plan} options={HERO_LAYOUTS} onChange={(l) => onPatch({ layout: l })} />
      </Section>
      <div className="space-y-2">
        <RichTextInput value={b.name} onChange={(name) => onPatch({ name })} placeholder="שם" />
        <RichTextInput value={b.tagline} onChange={(tagline) => onPatch({ tagline })} placeholder="שורת תיאור" />
        <input
          defaultValue={(b.words ?? []).join(", ")}
          onChange={(e) =>
            onPatch({
              words: e.target.value
                .split(",")
                .map((w) => w.trim())
                .filter(Boolean)
                .slice(0, 8),
            })
          }
          placeholder="מילים למכונת כתיבה, מופרדות בפסיקים (רשות)"
          className={fieldCls}
        />
        <input value={b.badge ?? ""} onChange={(e) => onPatch({ badge: e.target.value || undefined })} placeholder='תג סטטוס, למשל "פנוי/ה לפרויקטים"' maxLength={40} className={fieldCls} />
      </div>
      {(b.words ?? []).length > 0 && <TypingFields typing={b.typing} plan={plan} onChange={(typing) => onPatch({ typing })} />}
      {layout !== "minimal" && (
      <Section title="תמונת פרופיל">
        <ImageField value={b.avatarUrl} onChange={(avatarUrl) => onPatch({ avatarUrl: avatarUrl ?? null })} maxDim={640} />
        <Slider label="גודל" value={b.avatarScale ?? 80} min={48} max={200} step={4} suffix="px" onChange={(avatarScale) => onPatch({ avatarScale })} />
        <Seg
          value={b.avatar?.radius ?? (b.avatarShape === "square" ? "sm" : b.avatarShape === "rounded" ? "lg" : "full")}
          options={RADIUS_OPTS}
          onChange={(radius) => onPatch({ avatar: { ...(b.avatar ?? {}), radius, aspect: "square" } })}
        />
        <Label>צורה</Label>
        <Chips value={b.avatarMask ?? "none"} plan={plan} cols={4} options={AVATAR_SHAPES} onChange={(id) => onPatch({ avatarMask: id === "none" ? undefined : id })} />
        <Label>מסגרת</Label>
        <Chips value={b.avatarFrame ?? "none"} plan={plan} cols={4} options={AVATAR_FRAMES} onChange={(id) => onPatch({ avatarFrame: id === "none" ? undefined : id })} />
        <select
          value={b.avatarIdle ?? ""}
          onChange={(e) => onPatch({ avatarIdle: e.target.value || undefined })}
          className={fieldCls}
        >
          <option value="">אנימציה במנוחה: ללא</option>
          {AVATAR_IDLE.map((a) => (
            <option key={a.id} value={a.id}>
              אנימציה במנוחה: {a.name}
            </option>
          ))}
        </select>
      </Section>
      )}
      {(layout === "center" || layout === "cover") && (
        <Section title={layout === "cover" ? "תמונת שער" : "באנר"}>
          <ImageField value={b.bannerUrl} onChange={(bannerUrl) => onPatch({ bannerUrl: bannerUrl ?? null })} maxDim={1800} />
          {layout === "cover" && !b.bannerUrl && <p className="text-[11px] text-text-muted">אין תמונה? השער יזהר בצבעי המבטא שלכם.</p>}
        </Section>
      )}
    </div>
  );
}

function LinksEditor({ b, plan, onPatch }: { b: BlockOf<"links">; plan: Plan; onPatch: Patch }) {
  const c = caps(plan);
  const items = b.items;
  const setItems = (next: LinkItem[]) => onPatch({ items: next });
  const update = (i: number, p: Partial<LinkItem>) => setItems(items.map((it, j) => (j === i ? { ...it, ...p } : it)));
  return (
    <div className="space-y-3">
      <Seg
        value={b.layout ?? "list"}
        options={[
          { id: "list", label: "כפתורים" },
          { id: "grid", label: "אריחים" },
          { id: "cards", label: "כרטיסים" },
        ]}
        onChange={(layout) => onPatch({ layout })}
      />
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1 text-[11px] text-text-muted">
          תנועה במנוחה
          <select value={b.buttonIdle ?? ""} onChange={(e) => onPatch({ buttonIdle: e.target.value || undefined })} className="h-9 rounded-lg border border-border bg-surface-2 px-2 text-xs text-text">
            <option value="">כמו בעמוד</option>
            {BUTTON_IDLE.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[11px] text-text-muted">
          אפקט במעבר עכבר
          <select value={b.buttonFx ?? ""} onChange={(e) => onPatch({ buttonFx: e.target.value || undefined })} className="h-9 rounded-lg border border-border bg-surface-2 px-2 text-xs text-text">
            <option value="">כמו בעמוד</option>
            {BUTTON_FX.map((e) => {
              const locked = e.category === "Creative" && !c.creativeEffects;
              return (
                <option key={e.id} value={e.id}>
                  {e.name}
                  {locked ? " · Plus" : ""}
                </option>
              );
            })}
          </select>
        </label>
      </div>

      {items.map((it, i) => (
        <ItemCard key={i} onRemove={() => setItems(items.filter((_, j) => j !== i))}>
          <div className="flex items-start gap-2 pe-8">
            <IconPicker item={it} onChange={(p) => update(i, p)} />
            <div className="min-w-0 flex-1">
              <RichTextInput value={it.label} onChange={(label) => update(i, { label })} placeholder="תווית" />
            </div>
          </div>
          <input value={it.url} onChange={(e) => update(i, { url: e.target.value })} placeholder="קישור, מייל או טלפון" className={fieldCls} />
          <input value={it.sub ?? ""} onChange={(e) => update(i, { sub: e.target.value || undefined })} placeholder="כותרת משנה (רשות)" className={fieldCls} />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => update(i, { highlighted: !it.highlighted || undefined })}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs transition-colors",
                it.highlighted ? "border-primary bg-primary/10 text-text" : "border-border text-text-muted hover:text-text",
              )}
            >
              <Star className={cn("h-3.5 w-3.5", it.highlighted && "fill-primary text-primary-text")} /> הדגשה
            </button>
            <ThumbButton value={it.thumb} onChange={(thumb) => update(i, { thumb })} />
              <input
                type="color"
                value={it.color || "#00e5a0"}
                onChange={(e) => update(i, { color: e.target.value })}
                className="h-8 w-9 cursor-pointer rounded-lg border border-border bg-surface-2"
                title="הצבע של הכפתור הזה"
                aria-label="צבע הכפתור"
              />
              {it.color && (
                <button type="button" onClick={() => update(i, { color: undefined })} className="text-[11px] text-text-muted hover:text-text">
                  איפוס צבע
                </button>
              )}
              <select
                value={it.fx ?? ""}
                onChange={(e) => update(i, { fx: e.target.value || undefined })}
                className="h-8 min-w-0 flex-1 rounded-lg border border-border bg-surface-2 px-2 text-xs text-text"
                aria-label="אפקט מעבר העכבר של הכפתור"
              >
                <option value="">אפקט: ברירת מחדל</option>
                {BUTTON_FX.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            {!c.perElement && <TierPill tier="PLUS" />}
          </div>
          <LinkSchedule item={it} locked={!c.businessBlocks} onChange={(p) => update(i, p)} />
        </ItemCard>
      ))}
      <AddItem label="הוספת קישור" onClick={() => setItems([...items, { label: "קישור חדש", url: "https://", icon: "auto" }])} />
    </div>
  );
}

// datetime-local speaks the creator's local time; links store absolute ISO.
const toLocal = (iso?: string) => {
  const t = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(t) ? "" : new Date(t - new Date(t).getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};
const toIso = (v: string) => (v && !Number.isNaN(Date.parse(v)) ? new Date(v).toISOString() : undefined);

function LinkSchedule({ item, locked, onChange }: { item: LinkItem; locked: boolean; onChange: (p: Partial<LinkItem>) => void }) {
  const on = !!(item.from || item.until);
  const [now] = useState(Date.now);
  const state = !on ? "" : item.until && Date.parse(item.until) <= now ? "פג תוקף" : item.from && Date.parse(item.from) > now ? "מתוזמן" : "מוצג עכשיו";
  return (
    <details className="group" open={on || undefined}>
      <summary className="flex cursor-pointer list-none items-center gap-2 text-xs text-text-muted select-none hover:text-text">
        <span className="transition-transform group-open:rotate-90 rtl:-scale-x-100">›</span> תזמון
        {state && <span className="rounded-full border border-border px-2 py-0.5 text-[10px]">{state}</span>}
        {locked && <TierPill tier="PLUS" />}
      </summary>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className="space-y-1 text-[11px] text-text-muted">
          <span>מופיע החל מ־</span>
          <input type="datetime-local" value={toLocal(item.from)} onChange={(e) => onChange({ from: toIso(e.target.value) })} className={cn(fieldCls, "h-9 px-2 text-xs")} />
        </label>
        <label className="space-y-1 text-[11px] text-text-muted">
          <span>נעלם החל מ־</span>
          <input type="datetime-local" value={toLocal(item.until)} onChange={(e) => onChange({ until: toIso(e.target.value) })} className={cn(fieldCls, "h-9 px-2 text-xs")} />
        </label>
      </div>
      <p className="mt-1.5 text-[11px] text-text-muted">לדרופים, מבצעים ואירועים. בעורך הקישור תמיד מוצג.</p>
    </details>
  );
}

function IconPicker({ item, onChange }: { item: LinkItem; onChange: (p: Partial<LinkItem>) => void }) {
  // <details> rather than a focus popover: iOS Safari never focuses buttons.
  const close = (e: React.MouseEvent) => e.currentTarget.closest("details")?.removeAttribute("open");
  const auto = item.icon === "auto";
  return (
    <details className="relative shrink-0">
      <summary
        className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-xl border border-border bg-surface-2 text-lg text-text"
        aria-label="אייקון הקישור"
      >
        {auto ? <SocialIcon platform={platformFromUrl(item.url)} className="h-4 w-4" /> : item.icon || <span className="text-[10px] text-text-muted">אייקון</span>}
      </summary>
      <div className="absolute top-11 start-0 z-10 w-60 rounded-xl border border-border bg-bg p-2 shadow-2xl">
        <div className="mb-1.5 flex gap-1">
          <button
            type="button"
            onClick={(e) => {
              onChange({ icon: "auto" });
              close(e);
            }}
            className={cn("flex-1 rounded-lg border px-2 py-1 text-[11px]", auto ? "border-primary text-text" : "border-border text-text-muted")}
          >
            אוטומטי (לפי הקישור)
          </button>
          <button
            type="button"
            onClick={(e) => {
              onChange({ icon: undefined });
              close(e);
            }}
            className="flex-1 rounded-lg border border-border px-2 py-1 text-[11px] text-text-muted"
          >
            ללא
          </button>
        </div>
        <div className="grid grid-cols-8 gap-0.5">
          {EMOJI.map((em) => (
            <button
              key={em}
              type="button"
              onClick={(e) => {
                onChange({ icon: em });
                close(e);
              }}
              className="rounded-md p-1 text-base hover:bg-surface-2"
            >
              {em}
            </button>
          ))}
        </div>
      </div>
    </details>
  );
}

function ThumbButton({ value, onChange }: { value?: string; onChange: (v: string | undefined) => void }) {
  return (
    <details className="relative">
      <summary className="flex h-8 cursor-pointer list-none items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs text-text-muted hover:text-text">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-5 w-5 rounded object-cover" />
        ) : (
          <ImageIcon className="h-3.5 w-3.5" />
        )}
        תמונה ממוזערת
      </summary>
      <div className="absolute top-10 start-0 z-10 w-72 rounded-xl border border-border bg-bg p-2 shadow-2xl">
        <ImageField value={value} onChange={onChange} maxDim={400} />
      </div>
    </details>
  );
}

function TextEditor({ b, plan, onPatch }: { b: BlockOf<"text">; plan: Plan; onPatch: Patch }) {
  const c = caps(plan);
  return (
    <div className="space-y-2.5">
      <RichTextInput value={b.heading} onChange={(heading) => onPatch({ heading })} placeholder="כותרת (רשות)" />
      <RichTextInput value={b.body} onChange={(body) => onPatch({ body })} placeholder="טקסט" multiline />
      <div className="grid grid-cols-2 gap-2">
        <Seg value={b.align ?? "left"} options={ALIGNS} onChange={(align) => onPatch({ align })} />
        <Seg
          value={b.size ?? "md"}
          options={[
            { id: "sm", label: "S" },
            { id: "md", label: "M" },
            { id: "lg", label: "L" },
          ]}
          onChange={(size) => onPatch({ size })}
        />
      </div>
      <div className="flex items-center gap-2">
        <ColorField value={b.color} fallback="#9AA3AF" label="צבע טקסט" onChange={(color) => onPatch({ color })} onReset={() => onPatch({ color: undefined })} />
        {!c.perElement && <TierPill tier="PLUS" />}
      </div>
      <Toggle checked={!!b.spoiler} onChange={(spoiler) => onPatch({ spoiler: spoiler || undefined })} label="הסתרה מאחורי ספוילר שנחשף בלחיצה" />
    </div>
  );
}

function SocialsEditor({ b, plan, onPatch }: { b: BlockOf<"socials">; plan: Plan; onPatch: Patch }) {
  const c = caps(plan);
  const items = b.items;
  const setItems = (next: { platform: SocialPlatform; url: string }[]) => onPatch({ items: next });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Seg
          value={b.iconStyle ?? "plain"}
          options={[
            { id: "plain", label: "פשוט" },
            { id: "chip", label: "תגיות" },
            { id: "brand", label: "צבעי מותג" },
          ]}
          onChange={(iconStyle) => onPatch({ iconStyle })}
        />
        <Seg
          value={b.size ?? "md"}
          options={[
            { id: "sm", label: "S" },
            { id: "md", label: "M" },
            { id: "lg", label: "L" },
          ]}
          onChange={(size) => onPatch({ size })}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1 text-[11px] text-text-muted">
          אפקט במעבר עכבר
          <select value={b.iconFx ?? ""} onChange={(e) => onPatch({ iconFx: e.target.value || undefined })} className="h-9 rounded-lg border border-border bg-surface-2 px-2 text-xs text-text">
            <option value="">כמו בעמוד</option>
            {ICON_FX.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[11px] text-text-muted">
          תנועה במנוחה
          <select value={b.iconIdle ?? ""} onChange={(e) => onPatch({ iconIdle: e.target.value || undefined })} className="h-9 rounded-lg border border-border bg-surface-2 px-2 text-xs text-text">
            <option value="">כמו בעמוד</option>
            {ICON_IDLE.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {b.iconStyle !== "brand" && (
        <div className="flex items-center gap-2">
          <ColorField value={b.iconColor} fallback="#9AA3AF" label="צבע אייקונים" onChange={(iconColor) => onPatch({ iconColor })} onReset={() => onPatch({ iconColor: undefined })} />
          {!c.perElement && <TierPill tier="PLUS" />}
        </div>
      )}
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-surface-2 text-text">
            <SocialIcon platform={it.platform} className="h-4 w-4" />
          </span>
          <select
            value={it.platform}
            onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, platform: e.target.value as SocialPlatform } : x)))}
            className="h-10 w-28 shrink-0 rounded-xl border border-border bg-surface-2 px-2 text-sm text-text"
          >
            {SOCIAL_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <input
            value={it.url}
            onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))}
            placeholder={it.platform === "email" ? "you@example.com" : it.platform === "phone" ? "+972 50 123 4567" : "https://"}
            className={cn(fieldCls, "min-w-0")}
          />
          <button
            type="button"
            onClick={() => setItems(items.filter((_, j) => j !== i))}
            aria-label="הסרה"
            className="grid h-10 w-8 shrink-0 place-items-center text-text-muted hover:text-red-700"
          >
            ×
          </button>
        </div>
      ))}
      <AddItem
        label="הוספת פרופיל"
        onClick={() => {
          const used = new Set(items.map((x) => x.platform));
          const next = SOCIAL_OPTIONS.find((o) => !used.has(o.value))?.value ?? "website";
          setItems([...items, { platform: next, url: "" }]);
        }}
      />
    </div>
  );
}

function DividerEditor({ b, plan, onPatch }: { b: BlockOf<"divider">; plan: Plan; onPatch: Patch }) {
  const c = caps(plan);
  const styles: { id: NonNullable<BlockOf<"divider">["style"]>; label: string; plus?: boolean }[] = [
    { id: "line", label: "קו" },
    { id: "dashed", label: "מקווקו" },
    { id: "dotted", label: "מנוקד" },
    { id: "glow", label: "זוהר" },
    { id: "double", label: "כפול" },
    { id: "wave", label: "גל" },
    { id: "shimmer", label: "נצנוץ", plus: true },
    { id: "march", label: "צועד", plus: true },
    { id: "pulse", label: "פועם", plus: true },
  ];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-1.5">
        {styles.map((s) => {
          const locked = !!s.plus && !c.perElement;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onPatch({ style: s.id })}
              className={cn(
                "flex items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-xs",
                (b.style ?? "line") === s.id ? "border-primary text-text" : "border-border text-text-muted hover:text-text",
              )}
            >
              {s.label}
              {locked && <TierPill tier="PLUS" />}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <ColorField value={b.color} fallback="#2A2F3A" label="צבע המפריד" onChange={(color) => onPatch({ color })} onReset={() => onPatch({ color: undefined })} />
        {!c.perElement && <TierPill tier="PLUS" />}
      </div>
      <div className="rounded-lg border border-border bg-bg px-3 py-4">
        <div className={cn("dv", `dv-${b.style ?? "line"}`)} style={b.color ? ({ "--dvc": b.color } as React.CSSProperties) : undefined} />
      </div>
    </div>
  );
}

export { BLOCK_TIER, BLOCK_META };
