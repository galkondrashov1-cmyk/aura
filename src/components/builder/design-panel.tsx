"use client";

import { useState } from "react";
import { ChevronRight, Loader2, Shuffle, Sparkles, Wand2, Pipette, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomBackground, PageDesign } from "@/lib/blocks";
import {
  BACKGROUNDS,
  CARD_STYLES,
  BG_FX,
  BUTTON_FX,
  BUTTON_IDLE,
  ICON_FX,
  ICON_IDLE,
  type FullTheme,
  COLOR_PRESETS,
  FULL_THEMES,
  fullThemeSwatch,
  BUTTON_SHAPES,
  BUTTON_SHAPE_CLASS,
  BUTTON_SIZES,
  CONTENT_WIDTHS,
  SPACINGS,
  TEXT_SCALES,
  MOTION_SPEEDS,
  accentFromBackground,
  groupByCategory,
  bgCategoryTier,
  fontCategoryTier,
  cardCategoryTier,
  shapeTier,
  bgFxCategoryTier,
} from "@/lib/design";
import { FONTS, FONT_CATEGORIES, ALL_FONTS_HREF, fontFamilyVar } from "@/lib/fonts";
import { caps, PLAN_RANK, type Plan } from "@/lib/plans";
import {
  PAGE_LAYOUTS,
  TITLE_FX,
  HEADING_WEIGHTS,
  HEADING_CASES,
  HEADING_TRACKING,
  FONT_PAIRS,
  SECTION_STYLES,
  REVEALS,
  LIVE_BGS,
  CURSORS,
  INTROS,
  GRADIENT_TYPES,
  customBgCss,
  hslHex,
  remixDesign,
  paletteDesign,
} from "@/lib/studio";
import { samplePalette } from "@/lib/client-image";
import {
  Chips,
  ColorField,
  ImageField,
  Label,
  Modal,
  Section,
  Seg,
  Slider,
  TierPill,
  Toggle,
  fieldCls,
  useLocked,
} from "./ui";

type Tab = "style" | "background" | "type" | "buttons" | "layout" | "extras";
type Picker = null | "background" | "bgFx" | "card" | "font" | "headingFont";

const TABS: { id: Tab; label: string }[] = [
  { id: "style", label: "Style" },
  { id: "background", label: "Background" },
  { id: "type", label: "Type" },
  { id: "buttons", label: "Buttons" },
  { id: "layout", label: "Layout" },
  { id: "extras", label: "Extras" },
];

export function DesignPanel({
  design,
  plan,
  rtl,
  avatarUrl,
  onChange,
}: {
  design: PageDesign;
  plan: Plan;
  /** Page reads right-to-left (Remix then keeps Hebrew fonts). */
  rtl: boolean;
  /** Hero photo, for "match my photo". */
  avatarUrl?: string | null;
  onChange: (patch: Partial<PageDesign>) => void;
}) {
  const [tab, setTab] = useState<Tab>("style");
  const [open, setOpen] = useState<Picker>(null);
  const c = caps(plan);
  const { isLocked } = useLocked(plan);
  const pick = (patch: Partial<PageDesign>) => {
    onChange(patch);
    setOpen(null);
  };

  return (
    <div className="space-y-5">
      {/* Every font, for the pickers' live previews (React hoists this to <head>). */}
      <link rel="stylesheet" href={ALL_FONTS_HREF} precedence="fonts" />
      <div className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none]">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors",
              tab === t.id ? "bg-text text-bg" : "bg-surface-2 text-text-muted hover:text-text",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "style" && (
        <StyleTab design={design} plan={plan} rtl={rtl} avatarUrl={avatarUrl} onChange={onChange} />
      )}

      {tab === "background" && (
        <BackgroundTab design={design} plan={plan} onChange={onChange} openPicker={setOpen} />
      )}

      {tab === "type" && <TypeTab design={design} plan={plan} onChange={onChange} openPicker={setOpen} />}

      {tab === "buttons" && (
        <div className="space-y-5">
          <Section title="Button style">
            <MiniRow
              label="Look"
              value={CARD_STYLES.find((x) => x.id === design.card)?.name ?? "Default"}
              onClick={() => setOpen("card")}
            />
          </Section>
          <Section title="Shape">
            <Chips
              value={design.buttonShape ?? "pill"}
              plan={plan}
              options={BUTTON_SHAPES.map((s) => ({ ...s, tier: shapeTier(s.id) }))}
              onChange={(id) => onChange({ buttonShape: id })}
              render={(o) => (
                <>
                  <span className={cn("block h-4 w-12 bg-primary/80", BUTTON_SHAPE_CLASS[o.id])} />
                  <span>{o.name}</span>
                </>
              )}
            />
          </Section>
          <Section title="Size">
            <Seg
              value={design.buttonSize ?? "md"}
              options={BUTTON_SIZES.map((s) => ({ id: s.id, label: s.name }))}
              onChange={(id) => onChange({ buttonSize: id })}
            />
          </Section>
          <Section title="Motion" aside={<span className="text-[11px] text-text-muted">page defaults</span>}>
            <div className="grid grid-cols-2 gap-2">
              <SelectField
                label="Hover"
                value={design.buttonFx}
                onChange={(v) => onChange({ buttonFx: v })}
                options={BUTTON_FX.map((e) => ({ id: e.id, name: e.name, locked: e.category === "Creative" && !c.creativeEffects }))}
              />
              <SelectField
                label="Idle"
                value={design.buttonIdle}
                onChange={(v) => onChange({ buttonIdle: v })}
                options={BUTTON_IDLE.map((e) => ({ id: e.id, name: e.name }))}
              />
              <SelectField
                label="Icon hover"
                value={design.iconFx}
                onChange={(v) => onChange({ iconFx: v })}
                options={ICON_FX.map((e) => ({ id: e.id, name: e.name }))}
              />
              <SelectField
                label="Icon idle"
                value={design.iconIdle}
                onChange={(v) => onChange({ iconIdle: v })}
                options={ICON_IDLE.map((e) => ({ id: e.id, name: e.name }))}
              />
            </div>
          </Section>
        </div>
      )}

      {tab === "layout" && (
        <div className="space-y-5">
          <Section title="Page layout">
            <Chips
              value={design.layout ?? "stack"}
              plan={plan}
              options={PAGE_LAYOUTS}
              onChange={(id) => onChange({ layout: id })}
              render={(o) => (
                <>
                  <LayoutGlyph id={o.id} />
                  <span>{o.name}</span>
                </>
              )}
            />
          </Section>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Width</Label>
              <Seg
                value={design.contentWidth ?? "standard"}
                options={CONTENT_WIDTHS.map((s) => ({ id: s.id, label: s.name.slice(0, 6) }))}
                onChange={(id) => onChange({ contentWidth: id })}
              />
            </div>
            <div>
              <Label>Spacing</Label>
              <Seg
                value={design.spacing ?? "cozy"}
                options={SPACINGS.map((s) => ({ id: s.id, label: s.name.slice(0, 7) }))}
                onChange={(id) => onChange({ spacing: id })}
              />
            </div>
          </div>
          <Section title="Section style" aside={<span className="text-[11px] text-text-muted">behind every block</span>}>
            <Chips
              value={design.section ?? "none"}
              plan={plan}
              options={SECTION_STYLES}
              onChange={(id) => onChange({ section: id })}
              render={(o) => (
                <>
                  <span
                    className={cn("block h-5 w-full", o.id !== "none" && `sec sec-${o.id}`)}
                    style={{ padding: 0, borderRadius: 8 }}
                  />
                  <span>{o.name}</span>
                </>
              )}
            />
          </Section>
          <Section title="Scroll animation">
            <Chips value={design.reveal ?? "rise"} plan={plan} cols={4} options={REVEALS} onChange={(id) => onChange({ reveal: id })} />
          </Section>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label hint={!c.creativeEffects ? <TierPill tier="PLUS" /> : undefined}>Motion speed</Label>
              <Seg
                value={design.motionSpeed ?? "normal"}
                options={MOTION_SPEEDS.map((s) => ({ id: s.id, label: s.name }))}
                onChange={(id) => onChange({ motionSpeed: id })}
              />
            </div>
            <div>
              <Label>Opening</Label>
              <Seg
                value={design.intro ?? "aura"}
                options={INTROS.map((s) => ({ id: s.id as "aura" | "fade" | "none", label: s.id === "aura" ? "AURA" : s.name.split(" ").pop()! }))}
                onChange={(id) => onChange({ intro: id })}
              />
            </div>
          </div>
          <div>
            <Label hint="auto-detects Hebrew">Direction</Label>
            <Seg
              value={design.dir ?? "auto"}
              options={[
                { id: "auto", label: "Auto" },
                { id: "ltr", label: "Left → right" },
                { id: "rtl", label: "ימין ← שמאל" },
              ]}
              onChange={(id) => onChange({ dir: id as PageDesign["dir"] })}
            />
          </div>
        </div>
      )}

      {tab === "extras" && (
        <div className="space-y-5">
          <Section title="Cursor" aside={!c.proAssets ? <TierPill tier="PRO" /> : undefined}>
            <Chips value={design.cursor ?? "none"} plan={plan} options={CURSORS} onChange={(id) => onChange({ cursor: id })} />
            <p className="text-[11px] text-text-muted">Shows on desktop visitors&apos; screens (not in the editor).</p>
          </Section>
          <FabEditor design={design} plan={plan} onChange={onChange} />
          <Section title="Search & sharing" aside={!c.customSeo ? <TierPill tier="PLUS" /> : undefined}>
            <div className="space-y-2">
              <input
                value={design.seoTitle ?? ""}
                onChange={(e) => onChange({ seoTitle: e.target.value || undefined })}
                placeholder="Title in Google, tabs & link previews"
                className={fieldCls}
                maxLength={70}
              />
              <textarea
                value={design.seoDescription ?? ""}
                onChange={(e) => onChange({ seoDescription: e.target.value || undefined })}
                placeholder="One or two sentences about you"
                rows={2}
                maxLength={180}
                className={cn(fieldCls, "h-auto resize-none py-2")}
              />
            </div>

          </Section>
        </div>
      )}

      {/* ── Pickers ── */}
      {(open === "font" || open === "headingFont") && (
        <Modal title={open === "font" ? "Body font" : "Heading font"} onClose={() => setOpen(null)}>
          <button
            onClick={() => pick({ [open]: undefined })}
            className={cn(
              "mb-5 flex h-11 w-full items-center justify-center rounded-xl border text-sm",
              !design[open] ? "border-primary text-text" : "border-border text-text-muted hover:text-text",
            )}
          >
            {open === "font" ? "Default (Inter)" : "Same as body"}
          </button>
          {FONT_CATEGORIES.map((cat) => {
            const items = FONTS.filter((f) => f.category === cat);
            const tier = fontCategoryTier(cat);
            const locked = isLocked(tier);
            return (
              <section key={cat} className="mb-5">
                <p className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wide text-text-muted uppercase">
                  {cat === "Hebrew" ? "Hebrew · עברית" : cat} {locked && <TierPill tier={tier} />}
                </p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {items.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => pick({ [open]: f.id })}
                      className={cn(
                        "flex flex-col items-center gap-0.5 rounded-xl border px-2 py-3",
                        design[open] === f.id ? "border-primary" : "border-border",
                      )}
                      style={{ fontFamily: fontFamilyVar(f.id) }}
                    >
                      <span className="text-2xl leading-none text-text">{cat === "Hebrew" ? "אב" : "Ag"}</span>
                      <span className="truncate text-[11px] text-text-muted">{f.name}</span>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </Modal>
      )}

      {open === "background" && (
        <Modal title="Backgrounds" onClose={() => setOpen(null)}>
          <button
            onClick={() => pick({ background: undefined, bgCustom: undefined, bgImage: undefined })}
            className="mb-5 flex h-11 w-full items-center justify-center rounded-xl border border-border text-sm text-text-muted hover:text-text"
          >
            Default
          </button>
          {groupByCategory(BACKGROUNDS).map(([cat, items]) => {
            const tier = bgCategoryTier(cat);
            const locked = isLocked(tier);
            return (
              <section key={cat} className="mb-5">
                <p className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wide text-text-muted uppercase">
                  {cat} {locked && <TierPill tier={tier} />}
                </p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {items.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => pick({ background: b.id, bgCustom: undefined, bgImage: undefined })}
                      className={cn(
                        "overflow-hidden rounded-xl border",
                        design.background === b.id && !design.bgCustom ? "border-primary ring-2 ring-primary/30" : "border-border",
                      )}
                      title={b.name}
                    >
                      <span className="block h-14 w-full" style={{ background: b.css }} />
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </Modal>
      )}

      {open === "bgFx" && (
        <Modal title="Background effects" onClose={() => setOpen(null)}>
          {groupByCategory(BG_FX).map(([cat, items]) => {
            const tier = bgFxCategoryTier(cat);
            const locked = isLocked(tier);
            return (
              <section key={cat} className="mb-5">
                <p className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wide text-text-muted uppercase">
                  {cat} {locked && <TierPill tier={tier} />}
                </p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {items.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => pick({ bgFx: e.id })}
                      className={cn(
                        "overflow-hidden rounded-xl border",
                        (design.bgFx ?? "none") === e.id ? "border-primary" : "border-border",
                      )}
                    >
                      <span className="relative block h-14 w-full" style={{ background: "linear-gradient(160deg,#0b0b14,#1a1d24)" }}>
                        {e.className && <span className={cn("absolute inset-0", e.className)} />}
                      </span>
                      <span className="block px-1 py-1 text-center text-xs text-text-muted">{e.name}</span>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </Modal>
      )}

      {open === "card" && (
        <Modal title="Button styles" onClose={() => setOpen(null)}>
          <button
            onClick={() => pick({ card: undefined })}
            className="mb-5 flex h-11 w-full items-center justify-center rounded-xl border border-border text-sm text-text-muted hover:text-text"
          >
            Default
          </button>
          {groupByCategory(CARD_STYLES).map(([cat, items]) => {
            const tier = cardCategoryTier(cat);
            const locked = isLocked(tier);
            return (
              <section key={cat} className="mb-5">
                <p className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wide text-text-muted uppercase">
                  {cat} {locked && <TierPill tier={tier} />}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {items.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => pick({ card: o.id })}
                      className={cn("rounded-xl border p-2", design.card === o.id ? "border-primary" : "border-border")}
                    >
                      <span
                        className={cn(
                          "flex h-10 items-center justify-center rounded-full border border-border bg-surface-2 text-xs",
                          o.className,
                        )}
                      >
                        {o.name}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────── Style tab ───────────────────────────

function StyleTab({
  design,
  plan,
  rtl,
  avatarUrl,
  onChange,
}: {
  design: PageDesign;
  plan: Plan;
  rtl: boolean;
  avatarUrl?: string | null;
  onChange: (patch: Partial<PageDesign>) => void;
}) {
  const c = caps(plan);
  const [matching, setMatching] = useState(false);
  const [matchError, setMatchError] = useState("");
  const [remixes, setRemixes] = useState(0);

  const matchPhoto = async () => {
    if (!avatarUrl) return;
    setMatching(true);
    setMatchError("");
    try {
      const patch = paletteDesign(await samplePalette(avatarUrl));
      if (patch) onChange(patch);
      else setMatchError("That photo is too grey to pull colors from.");
    } catch {
      setMatchError("Couldn't read that photo's colors.");
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 p-4">
        <span
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(80% 120% at 0% 0%, var(--primary), transparent 60%), radial-gradient(70% 120% at 100% 100%, #a855f7, transparent 60%)" }}
        />
        <div className="relative">
          <p className="font-display text-base font-medium">Remix</p>
          <p className="mt-0.5 text-xs text-text-muted">
            A brand-new, coherent look — colors, fonts, buttons, motion. Infinite combinations.
          </p>
          <button
            type="button"
            onClick={() => {
              onChange(remixDesign(plan, rtl));
              setRemixes((n) => n + 1);
            }}
            className="aura-glow mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-ink transition hover:brightness-110 active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" /> {remixes ? "Remix again" : "Remix my page"}
          </button>
          {remixes > 0 && <p className="mt-1.5 text-center text-[11px] text-text-muted">Not it? Undo (⌘Z) brings back the last one.</p>}
        </div>
      </div>

      <button
        type="button"
        onClick={matchPhoto}
        disabled={matching || !avatarUrl}
        className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface-2 p-3 text-start transition-colors hover:border-primary/50 disabled:opacity-60"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-bg">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <Pipette className="h-4 w-4 text-text-muted" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 text-sm text-text">
            Match my photo {!c.customBackgrounds && <TierPill tier="PLUS" />}
          </span>
          <span className="block text-xs text-text-muted">
            {avatarUrl ? "Build the palette from your profile picture" : "Add a profile photo to the header first"}
          </span>
        </span>
        {matching ? <Loader2 className="h-4 w-4 animate-spin text-text-muted" /> : <Wand2 className="h-4 w-4 text-text-muted" />}
      </button>
      {matchError && <p className="-mt-3 text-xs text-red-400">{matchError}</p>}

      <Section
        title="Themes"
        aside={
          c.premiumThemes ? (
            <button
              type="button"
              onClick={() => {
                const pool = FULL_THEMES.filter((t) => t.tier === "PLUS" || c.proAssets);
                onChange({ ...pool[Math.floor(Math.random() * pool.length)].design, bgCustom: undefined, bgImage: undefined });
              }}
              className="flex items-center gap-1 text-[11px] text-text-muted hover:text-text"
            >
              <Shuffle className="h-3 w-3" /> Surprise me
            </button>
          ) : (
            <TierPill tier="PLUS" />
          )
        }
      >
        <ThemeGrid themes={FULL_THEMES} design={design} plan={plan} onChange={onChange} />
      </Section>

      <Section title="Accent color">
        <div className="flex flex-wrap gap-1.5">
          {COLOR_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange({ accent: p.accent, background: p.background, bgCustom: undefined, bgImage: undefined })}
              className={cn(
                "h-7 w-7 shrink-0 rounded-full border-2 transition-transform hover:scale-110",
                design.accent === p.accent ? "border-text" : "border-transparent",
              )}
              style={{ background: p.accent }}
              title={p.name}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ColorField
            value={design.accent}
            fallback="#00E5A0"
            label="Accent"
            onChange={(v) => onChange({ accent: v })}
            onReset={() => onChange({ accent: undefined })}
          />
          <button
            type="button"
            onClick={() => {
              const a = accentFromBackground(design.background);
              if (a) onChange({ accent: a });
            }}
            disabled={!design.background}
            title="Pick a color that fits your preset background"
            className="ml-auto flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-2.5 text-xs text-text-muted transition-colors hover:text-text disabled:opacity-40"
          >
            <Wand2 className="h-3.5 w-3.5" /> Match bg
          </button>
        </div>
      </Section>

      <Section title="Text color">
        <ColorField
          value={design.textColor}
          fallback="#FFFFFF"
          label="Text"
          onChange={(v) => onChange({ textColor: v })}
          onReset={() => onChange({ textColor: undefined })}
        />
      </Section>
    </div>
  );
}

function ThemeGrid({
  themes,
  design,
  plan,
  onChange,
}: {
  themes: FullTheme[];
  design: PageDesign;
  plan: Plan;
  onChange: (patch: Partial<PageDesign>) => void;
}) {
  const { isLocked } = useLocked(plan);
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {themes.map((t) => {
        const locked = isLocked(t.tier);
        const active = design.accent === t.accent && design.background === t.design.background && !design.bgCustom;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange({ ...t.design, bgCustom: undefined, bgImage: undefined })}
            className={cn("group text-center")}
            title={t.name}
          >
            <span
              className={cn(
                "relative block aspect-square w-full overflow-hidden rounded-xl border transition-transform group-hover:scale-105",
                active ? "border-primary ring-2 ring-primary/40" : "border-border",
              )}
              style={{ background: fullThemeSwatch(t) }}
            >
              <span className="absolute inset-x-2 bottom-2 h-1.5 rounded-full" style={{ background: t.accent }} />
              {locked && (
                <span className="absolute top-1 right-1">
                  <TierPill tier={t.tier} />
                </span>
              )}
            </span>
            <span className="mt-1 block truncate text-[10px] text-text-muted">{t.name}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────── Background tab ───────────────────────────

function randomGradient(accent?: string): CustomBackground {
  const h = accent ? hexHue(accent) : Math.floor(Math.random() * 360);
  const h2 = (h + 40 + Math.floor(Math.random() * 140)) % 360;
  return { type: "mesh", colors: [hslHex(h, 70, 26), hslHex(h2, 70, 22), hslHex((h + 300) % 360, 65, 18)], angle: 150 };
}

function hexHue(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) return 220;
  const d = max - min;
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return Math.round(h * 60);
}

function BackgroundTab({
  design,
  plan,
  onChange,
  openPicker,
}: {
  design: PageDesign;
  plan: Plan;
  onChange: (patch: Partial<PageDesign>) => void;
  openPicker: (p: Picker) => void;
}) {
  const c = caps(plan);
  // "Photo" stays selected while no photo has been picked yet.
  const [photoPending, setPhotoPending] = useState(false);
  const mode = design.bgImage || photoPending ? "photo" : design.bgCustom ? "gradient" : "preset";
  const grad = design.bgCustom;

  const setMode = (m: string) => {
    setPhotoPending(false);
    if (m === "preset") return onChange({ bgCustom: undefined, bgImage: undefined });
    if (m === "gradient") onChange({ bgImage: undefined, bgCustom: grad ?? randomGradient(design.accent) });
    if (m === "photo") setPhotoPending(true);
  };

  const setGrad = (g: Partial<CustomBackground>) => grad && onChange({ bgCustom: { ...grad, ...g } });

  return (
    <div className="space-y-5">
      <Seg
        value={mode}
        options={[
          { id: "preset", label: "Presets" },
          { id: "gradient", label: <>Gradient {!c.customBackgrounds && <TierPill tier="PLUS" />}</> },
          { id: "photo", label: <>Photo {!c.customBackgrounds && <TierPill tier="PLUS" />}</> },
        ]}
        onChange={setMode}
      />

      {mode === "preset" && (
        <Section
          title="Preset backgrounds"
          aside={
            <button type="button" onClick={() => openPicker("background")} className="flex items-center gap-0.5 text-[11px] text-primary hover:underline">
              All {BACKGROUNDS.length} <ChevronRight className="h-3 w-3" />
            </button>
          }
        >
          <div className="grid grid-cols-6 gap-1.5">
            {BACKGROUNDS.filter((b) => b.id.endsWith("-2"))
              .slice(0, 12)
              .map((b) => {
                const tier = bgCategoryTier(b.category);
                const locked = PLAN_RANK[tier] > PLAN_RANK[plan];
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onChange({ background: b.id })}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-lg border",
                      design.background === b.id ? "border-primary ring-2 ring-primary/30" : "border-border",
                    )}
                    style={{ background: b.css }}
                    title={b.name}
                  >
                    {locked && (
                      <span className="absolute top-0.5 right-0.5 scale-90">
                        <TierPill tier={tier} />
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </Section>
      )}

      {mode === "gradient" && grad && (
        <div className="space-y-3">
          <div
            className={cn("h-24 rounded-2xl border border-border", design.bgAnimate && "bg-pan")}
            style={{ background: customBgCss(grad) }}
          />
          <Seg value={grad.type} options={GRADIENT_TYPES.map((t) => ({ id: t.id, label: t.name }))} onChange={(type) => setGrad({ type })} />
          <div className="flex flex-wrap items-center gap-2">
            {grad.colors.map((col, i) => (
              <span key={i} className="relative">
                <input
                  type="color"
                  value={col}
                  onChange={(e) => setGrad({ colors: grad.colors.map((x, j) => (j === i ? e.target.value : x)) })}
                  className="h-10 w-12 cursor-pointer rounded-lg border border-border bg-surface-2"
                  aria-label={`Gradient color ${i + 1}`}
                />
                {grad.colors.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setGrad({ colors: grad.colors.filter((_, j) => j !== i) })}
                    aria-label="Remove color"
                    className="absolute -top-1.5 -right-1.5 grid h-4 w-4 place-items-center rounded-full bg-surface-2 text-text-muted ring-1 ring-border hover:text-text"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                )}
              </span>
            ))}
            {grad.colors.length < 4 && (
              <button
                type="button"
                onClick={() => setGrad({ colors: [...grad.colors, design.accent ?? "#00E5A0"] })}
                className="grid h-10 w-12 place-items-center rounded-lg border border-dashed border-border text-text-muted hover:text-text"
                aria-label="Add color"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onChange({ bgCustom: { ...randomGradient(), type: grad.type, angle: grad.angle } })}
              className="ml-auto flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-xs text-text-muted hover:text-text"
            >
              <Shuffle className="h-3.5 w-3.5" /> Shuffle
            </button>
          </div>
          {(grad.type === "linear" || grad.type === "conic") && (
            <Slider label="Angle" value={grad.angle ?? 150} min={0} max={360} suffix="°" onChange={(angle) => setGrad({ angle })} />
          )}
          <Toggle checked={!!design.bgAnimate} onChange={(v) => onChange({ bgAnimate: v || undefined })} label="Slowly flow the gradient" />
        </div>
      )}

      {mode === "photo" && (
        <div className="space-y-3">
          <ImageField value={design.bgImage} onChange={(url) => onChange({ bgImage: url })} maxDim={2200} />
          <Slider label="Darken" value={design.bgImageDim ?? 45} min={0} max={90} suffix="%" onChange={(v) => onChange({ bgImageDim: v })} />
          <Slider label="Blur" value={design.bgImageBlur ?? 0} min={0} max={30} suffix="px" onChange={(v) => onChange({ bgImageBlur: v })} />
          <p className="text-[11px] text-text-muted">Tip: darken 40–60% keeps text readable on busy photos.</p>
        </div>
      )}

      <Section title="Live background">
        <Chips value={design.liveBg ?? "none"} plan={plan} options={LIVE_BGS} onChange={(id) => onChange({ liveBg: id })} />
      </Section>

      <Section title="Overlay effect">
        <MiniRow label="Effect" value={BG_FX.find((e) => e.id === design.bgFx)?.name ?? "None"} onClick={() => openPicker("bgFx")} />
      </Section>
    </div>
  );
}

// ─────────────────────────── Type tab ───────────────────────────

function TypeTab({
  design,
  plan,
  onChange,
  openPicker,
}: {
  design: PageDesign;
  plan: Plan;
  onChange: (patch: Partial<PageDesign>) => void;
  openPicker: (p: Picker) => void;
}) {
  const { isLocked } = useLocked(plan);
  const fontName = (id?: string) => FONTS.find((f) => f.id === id)?.name;
  const fontTier = (id: string) => fontCategoryTier(FONTS.find((f) => f.id === id)?.category ?? "Sans");
  const fontVar = fontFamilyVar;

  return (
    <div className="space-y-5">
      <Section title="Font pairings">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {FONT_PAIRS.map((p) => {
            const tier = PLAN_RANK[fontTier(p.head)] > PLAN_RANK[fontTier(p.body)] ? fontTier(p.head) : fontTier(p.body);
            const locked = isLocked(tier);
            const active = design.headingFont === p.head && design.font === p.body;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange({ headingFont: p.head, font: p.body })}
                className={cn(
                  "relative rounded-xl border px-2.5 py-2 text-start",
                  active ? "border-primary bg-primary/10" : "border-border bg-surface-2",
                )}
              >
                <span className="block truncate text-lg leading-tight text-text" style={{ fontFamily: fontVar(p.head) }}>
                  {p.id.startsWith("hebrew") ? "כותרת" : "Headline"}
                </span>
                <span className="block truncate text-[11px] text-text-muted" style={{ fontFamily: fontVar(p.body) }}>
                  {p.name}
                </span>
                {locked && (
                  <span className="absolute top-1.5 right-1.5">
                    <TierPill tier={tier} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      <div className="grid grid-cols-2 gap-2">
        <MiniRow label="Heading font" value={fontName(design.headingFont) ?? "Same as body"} onClick={() => openPicker("headingFont")} />
        <MiniRow label="Body font" value={fontName(design.font) ?? "Default"} onClick={() => openPicker("font")} />
      </div>

      <Section title="Title effect">
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
          {TITLE_FX.map((fx) => {
            const locked = isLocked(fx.tier);
            const active = (design.titleFx ?? "none") === fx.id;
            return (
              <button
                key={fx.id}
                type="button"
                onClick={() => onChange({ titleFx: fx.id })}
                className={cn(
                  "relative flex flex-col items-center gap-1 overflow-hidden rounded-xl border px-1 pt-2.5 pb-1.5",
                  active ? "border-primary bg-primary/10" : "border-border bg-[#0d0f14]",
                )}
                style={{ ["--primary" as string]: design.accent ?? "#00E5A0", ["--text" as string]: "#eef0f3" }}
              >
                <span data-tfx={fx.id === "none" ? undefined : fx.id} className="block">
                  <span
                    className="pg-title block text-white [--h1:1.5rem]"
                    style={{ fontFamily: fontVar(design.headingFont ?? design.font) }}
                  >
                    <span className="tfx" data-text="Aa">
                      Aa
                    </span>
                  </span>
                </span>
                <span className="text-[10px] text-text-muted">{fx.name}</span>
                {locked && (
                  <span className="absolute top-1 right-1">
                    <TierPill tier={fx.tier} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      <div className="space-y-3">
        <div>
          <Label>Heading weight</Label>
          <Seg
            value={design.headingWeight ?? "normal"}
            options={HEADING_WEIGHTS.map((w) => ({ id: w.id, label: <span style={{ fontWeight: Number(w.value) }}>{w.name}</span> }))}
            onChange={(id) => onChange({ headingWeight: id })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Case</Label>
            <Seg value={design.headingCase ?? "none"} options={HEADING_CASES.map((x) => ({ id: x.id, label: x.name }))} onChange={(id) => onChange({ headingCase: id })} />
          </div>
          <div>
            <Label>Letter spacing</Label>
            <Seg value={design.headingTracking ?? "normal"} options={HEADING_TRACKING.map((x) => ({ id: x.id, label: x.name }))} onChange={(id) => onChange({ headingTracking: id })} />
          </div>
        </div>
        <div>
          <Label>Text size</Label>
          <Seg value={design.textScale ?? "normal"} options={TEXT_SCALES.map((x) => ({ id: x.id, label: x.name }))} onChange={(id) => onChange({ textScale: id })} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── Extras ───────────────────────────

function FabEditor({
  design,
  plan,
  onChange,
}: {
  design: PageDesign;
  plan: Plan;
  onChange: (patch: Partial<PageDesign>) => void;
}) {
  const c = caps(plan);
  const fab = design.fab;
  const kind = fab?.kind ?? "off";
  const placeholders = {
    whatsapp: "+972 50 123 4567",
    phone: "+972 50 123 4567",
    email: "you@email.com",
    link: "https://…",
  };
  return (
    <Section title="Floating button" aside={!c.floatingButton ? <TierPill tier="PLUS" /> : undefined}>
      <Seg
        value={kind}
        options={[
          { id: "off", label: "Off" },
          { id: "whatsapp", label: "WhatsApp" },
          { id: "phone", label: "Call" },
          { id: "email", label: "Email" },
          { id: "link", label: "Link" },
        ]}
        onChange={(k) => {
          if (k === "off") return onChange({ fab: undefined });
          onChange({ fab: { kind: k, value: fab?.value ?? "", label: fab?.label } });
        }}
      />
      {fab && (
        <div className="grid grid-cols-[1fr_8rem] gap-2">
          <input
            value={fab.value}
            onChange={(e) => onChange({ fab: { ...fab, value: e.target.value } })}
            placeholder={placeholders[fab.kind]}
            className={fieldCls}
          />
          <input
            value={fab.label ?? ""}
            onChange={(e) => onChange({ fab: { ...fab, label: e.target.value || undefined } })}
            placeholder="Label (optional)"
            maxLength={20}
            className={fieldCls}
          />
        </div>
      )}
      <p className="text-[11px] text-text-muted">Stays in the corner while visitors scroll — one tap to reach you.</p>
    </Section>
  );
}

// ─────────────────────────── Bits ───────────────────────────

function LayoutGlyph({ id }: { id: string }) {
  if (id === "card") {
    return (
      <span className="grid h-8 w-11 place-items-center rounded-md bg-primary/25">
        <span className="h-6 w-6 rounded-[4px] bg-text/70" />
      </span>
    );
  }
  if (id === "split") {
    return (
      <span className="flex h-8 w-11 gap-1 rounded-md bg-primary/25 p-1">
        <span className="w-4 rounded-[3px] bg-text/70" />
        <span className="flex flex-1 flex-col gap-0.5">
          <span className="h-1.5 rounded-sm bg-text/50" />
          <span className="h-1.5 rounded-sm bg-text/50" />
          <span className="h-1.5 rounded-sm bg-text/50" />
        </span>
      </span>
    );
  }
  return (
    <span className="flex h-8 w-11 flex-col items-center gap-0.5 rounded-md bg-primary/25 p-1">
      <span className="h-2 w-2 rounded-full bg-text/70" />
      <span className="h-1 w-6 rounded-sm bg-text/50" />
      <span className="h-1 w-6 rounded-sm bg-text/50" />
    </span>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value?: string;
  onChange: (v: string | undefined) => void;
  options: { id: string; name: string; locked?: boolean }[];
}) {
  return (
    <label className="flex flex-col gap-1 text-[11px] text-text-muted">
      {label}
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="h-9 rounded-lg border border-border bg-surface-2 px-2 text-xs text-text"
      >
        <option value="">None</option>
        {options.map((o) => (
          <option key={o.id} value={o.id} disabled={o.locked}>
            {o.name}
            {o.locked ? " · Plus" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}

function MiniRow({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col items-start gap-0.5 rounded-xl border border-border bg-surface-2 px-3 py-2 text-start transition-colors hover:border-primary/50"
    >
      <span className="text-[11px] text-text-muted">{label}</span>
      <span className="flex w-full items-center justify-between gap-1">
        <span className="truncate text-sm text-text">{value}</span>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-text-muted" />
      </span>
    </button>
  );
}
