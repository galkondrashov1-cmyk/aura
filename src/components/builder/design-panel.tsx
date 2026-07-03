"use client";

import { useState } from "react";
import { X, ChevronRight, Wand2, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PageDesign } from "@/lib/blocks";
import {
  BACKGROUNDS,
  CARD_STYLES,
  BG_FX,
  type FullTheme,
  COLOR_PRESETS,
  FULL_THEMES,
  fullThemeSwatch,
  BUTTON_SHAPES,
  BUTTON_SIZES,
  CONTENT_WIDTHS,
  SPACINGS,
  TEXT_SCALES,
  MOTION_SPEEDS,
  accentFromBackground,
  groupByCategory,
} from "@/lib/design";
import { FONTS } from "@/lib/fonts";
import { caps, PLAN_RANK, type Plan } from "@/lib/plans";
import {
  bgCategoryTier,
  fontCategoryTier,
  cardCategoryTier,
  shapeTier,
  bgFxCategoryTier,
} from "@/lib/design";
import { PlanLock, PlanPill } from "./plan-lock";

type Picker =
  | "background"
  | "bgFx"
  | "card"
  | "font"
  | "buttonShape"
  | "buttonSize"
  | "contentWidth"
  | "spacing"
  | "textScale"
  | "motionSpeed";

export function DesignPanel({
  design,
  plan,
  onChange,
}: {
  design: PageDesign;
  plan: Plan;
  onChange: (patch: Partial<PageDesign>) => void;
}) {
  const [open, setOpen] = useState<Picker | null>(null);
  const c = caps(plan);

  const names = {
    background: BACKGROUNDS.find((b) => b.id === design.background)?.name ?? "Default",
    bgFx: BG_FX.find((e) => e.id === design.bgFx)?.name ?? "None",
    card: CARD_STYLES.find((c) => c.id === design.card)?.name ?? "Default",
    font: FONTS.find((f) => f.id === design.font)?.name ?? "Default",
    buttonShape: BUTTON_SHAPES.find((s) => s.id === design.buttonShape)?.name ?? "Pill",
    buttonSize: BUTTON_SIZES.find((s) => s.id === design.buttonSize)?.name ?? "Medium",
    contentWidth: CONTENT_WIDTHS.find((s) => s.id === design.contentWidth)?.name ?? "Standard",
    spacing: SPACINGS.find((s) => s.id === design.spacing)?.name ?? "Cozy",
    textScale: TEXT_SCALES.find((s) => s.id === design.textScale)?.name ?? "Normal",
    motionSpeed: MOTION_SPEEDS.find((s) => s.id === design.motionSpeed)?.name ?? "Normal",
  };

  const pick = (patch: Partial<PageDesign>) => {
    onChange(patch);
    setOpen(null);
  };

  const matchAccent = () => {
    const a = accentFromBackground(design.background);
    if (a) onChange({ accent: a });
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-3.5">
      <p className="mb-2.5 text-sm font-medium">Design</p>

      {/* One-click full themes — complete profiles (palette + buttons +
          typography + animations), every piece editable afterwards. */}
      <div className="mb-3">
        <div className="mb-1.5 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs text-text-muted">
            One-click themes {!c.premiumThemes && <PlanPill />}
          </p>
          {c.premiumThemes && (
            <button
              type="button"
              onClick={() => {
                const pool = FULL_THEMES.filter((t) => t.tier === "PLUS" || c.proAssets);
                const t = pool[Math.floor(Math.random() * pool.length)];
                onChange(t.design);
              }}
              className="flex items-center gap-1 rounded-lg border border-border bg-surface-2 px-2 py-1 text-[11px] text-text-muted transition-colors hover:border-primary/50 hover:text-text"
            >
              <Shuffle className="h-3 w-3" /> Surprise me
            </button>
          )}
        </div>
        <PlanLock locked={!c.premiumThemes}>
          <ThemeGrid
            themes={FULL_THEMES.filter((t) => t.tier === "PLUS")}
            design={design}
            onChange={onChange}
          />
        </PlanLock>
        <p className="mt-2.5 mb-1.5 flex items-center gap-1.5 text-xs text-text-muted">
          Pro themes {!c.proAssets && <PlanPill tier="Pro" />}
        </p>
        <PlanLock locked={!c.proAssets} tier="Pro">
          <ThemeGrid
            themes={FULL_THEMES.filter((t) => t.tier === "PRO")}
            design={design}
            onChange={onChange}
          />
        </PlanLock>
      </div>

      {/* Quick accent presets */}
      <div className="mb-3">
        <p className="mb-1.5 text-xs text-text-muted">Quick colors</p>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((p) => {
            const active = design.accent === p.accent && (design.background ?? undefined) === p.background;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange({ accent: p.accent, background: p.background })}
                className={cn(
                  "h-7 w-7 shrink-0 rounded-full border-2",
                  active ? "border-primary" : "border-border",
                )}
                style={{ background: p.accent }}
                title={p.name}
              />
            );
          })}
        </div>
      </div>

      {/* Accent color — the highlight color for buttons, icons & glows */}
      <div className="mb-3">
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-xs text-text-muted">
            Accent color <span className="text-text-muted/60">· buttons, icons &amp; glows</span>
          </p>
          {design.accent && (
            <button
              onClick={() => onChange({ accent: undefined })}
              className="text-xs text-text-muted hover:text-text"
            >
              Reset
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={design.accent || "#00E5A0"}
            onChange={(e) => onChange({ accent: e.target.value })}
            className="h-9 w-11 shrink-0 cursor-pointer rounded-lg border border-border bg-surface-2"
            aria-label="Pick accent color"
          />
          <input
            type="text"
            value={design.accent ?? ""}
            placeholder="#00E5A0"
            onChange={(e) => {
              const v = e.target.value.trim();
              if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange({ accent: v });
            }}
            className="h-9 w-24 rounded-lg border border-border bg-surface-2 px-2.5 font-mono text-xs text-text placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
            aria-label="Accent hex code"
          />
          <button
            type="button"
            onClick={matchAccent}
            disabled={!design.background}
            title={design.background ? "Pick a color that fits your background" : "Pick a background first"}
            className="ml-auto flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 text-xs text-text-muted transition-colors hover:border-primary/50 hover:text-text disabled:opacity-40"
          >
            <Wand2 className="h-3.5 w-3.5" /> Match background
          </button>
        </div>
      </div>

      {/* Global text color */}
      <div className="mb-3">
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-xs text-text-muted">Text color (all text)</p>
          {design.textColor && (
            <button
              onClick={() => onChange({ textColor: undefined })}
              className="text-xs text-text-muted hover:text-text"
            >
              Reset
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={design.textColor || "#ffffff"}
            onChange={(e) => onChange({ textColor: e.target.value })}
            className="h-9 w-11 shrink-0 cursor-pointer rounded-lg border border-border bg-surface-2"
            aria-label="Text color"
          />
          <span className="text-xs text-text-muted">
            {design.textColor ?? "Default"} · tip: color a single line in any text block
          </span>
        </div>
      </div>

      {/* Page basics */}
      <p className="mb-1.5 text-xs text-text-muted">Page</p>
      <div className="grid grid-cols-2 gap-2">
        <MiniRow label="Font" value={names.font} onClick={() => setOpen("font")} />
        <MiniRow label="Text size" value={names.textScale} onClick={() => setOpen("textScale")} />
        <MiniRow label="Background" value={names.background} onClick={() => setOpen("background")} />
        <MiniRow label="Bg effect" value={names.bgFx} onClick={() => setOpen("bgFx")} />
        <MiniRow label="Content width" value={names.contentWidth} onClick={() => setOpen("contentWidth")} />
        <MiniRow label="Spacing" value={names.spacing} onClick={() => setOpen("spacing")} />
        <PlanLock locked={!c.creativeEffects}>
          <MiniRow label="Motion speed" value={names.motionSpeed} onClick={() => setOpen("motionSpeed")} />
        </PlanLock>
      </div>

      {/* Buttons (page defaults — override any single button in its block) */}
      <p className="mt-3 mb-1.5 text-xs text-text-muted">
        Buttons <span className="text-text-muted/60">· defaults (override per button in its block)</span>
      </p>
      <div className="grid grid-cols-2 gap-2">
        <MiniRow label="Style" value={names.card} onClick={() => setOpen("card")} />
        <MiniRow label="Shape" value={names.buttonShape} onClick={() => setOpen("buttonShape")} />
        <MiniRow label="Size" value={names.buttonSize} onClick={() => setOpen("buttonSize")} />
      </div>
      <p className="mt-2 rounded-lg bg-surface-2/60 px-3 py-2 text-[11px] leading-relaxed text-text-muted">
        Animations &amp; hover effects now live on each block — open a block from
        the <span className="text-text">Blocks</span> tab to set its motion.
      </p>

      {/* Custom SEO (Pro) */}
      <p className="mt-3 mb-1.5 flex items-center gap-1.5 text-xs text-text-muted">
        SEO {!c.customSeo && <PlanPill tier="Pro" />}
      </p>
      <PlanLock locked={!c.customSeo} tier="Pro">
        <div className="space-y-2">
          <input
            type="text"
            value={design.seoTitle ?? ""}
            onChange={(e) => onChange({ seoTitle: e.target.value || undefined })}
            placeholder="Search title (shows in Google & tabs)"
            className="h-10 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm text-text placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
            aria-label="SEO title"
          />
          <textarea
            value={design.seoDescription ?? ""}
            onChange={(e) => onChange({ seoDescription: e.target.value || undefined })}
            placeholder="Search description (1–2 sentences)"
            rows={2}
            className="w-full resize-none rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
            aria-label="SEO description"
          />
        </div>
      </PlanLock>

      {open === "font" && (
        <Modal title="Fonts" onClose={() => setOpen(null)}>
          <DefaultTile selected={!design.font} onClick={() => pick({ font: undefined })} />
          {groupByCategory(FONTS).map(([cat, items]) => {
            const locked = PLAN_RANK[fontCategoryTier(cat)] > PLAN_RANK[plan];
            return (
              <PlanLock key={cat} locked={locked}>
                <Section title={cat} cols={3}>
                  {items.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => pick({ font: f.id })}
                      className={cn(
                        "flex flex-col items-center gap-0.5 rounded-xl border px-2 py-3",
                        design.font === f.id ? "border-primary" : "border-border",
                      )}
                      style={{ fontFamily: `var(${f.variable})` }}
                    >
                      <span className="text-2xl leading-none text-text">Ag</span>
                      <span className="text-[11px] text-text-muted">{f.name}</span>
                    </button>
                  ))}
                </Section>
              </PlanLock>
            );
          })}
        </Modal>
      )}

      {open === "background" && (
        <Modal title="Backgrounds" onClose={() => setOpen(null)}>
          <DefaultTile selected={!design.background} onClick={() => pick({ background: undefined })} />
          {groupByCategory(BACKGROUNDS).map(([cat, items]) => {
            const tier = bgCategoryTier(cat);
            const locked = PLAN_RANK[tier] > PLAN_RANK[plan];
            return (
              <PlanLock key={cat} locked={locked} tier={tier === "PRO" ? "Pro" : "Plus"}>
                <Section title={cat}>
                  {items.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => pick({ background: b.id })}
                      className={cn(
                        "overflow-hidden rounded-xl border",
                        design.background === b.id ? "border-primary" : "border-border",
                      )}
                      title={b.name}
                    >
                      <span className="block h-14 w-full" style={{ background: b.css }} />
                    </button>
                  ))}
                </Section>
              </PlanLock>
            );
          })}
        </Modal>
      )}

      {open === "bgFx" && (
        <Modal title="Background effects" onClose={() => setOpen(null)}>
          {groupByCategory(BG_FX).map(([cat, items]) => {
            const locked = PLAN_RANK[bgFxCategoryTier(cat)] > PLAN_RANK[plan];
            return (
            <PlanLock key={cat} locked={locked}>
            <Section title={cat} cols={3}>
              {items.map((e) => (
                <button
                  key={e.id}
                  onClick={() => pick({ bgFx: e.id })}
                  className={cn(
                    "overflow-hidden rounded-xl border",
                    (design.bgFx ?? "none") === e.id ? "border-primary" : "border-border",
                  )}
                >
                  <span
                    className="relative block h-14 w-full"
                    style={{ background: "linear-gradient(160deg,#0b0b14,#1a1d24)" }}
                  >
                    {e.className && <span className={cn("absolute inset-0", e.className)} />}
                  </span>
                  <span className="block px-1 py-1 text-center text-xs text-text-muted">{e.name}</span>
                </button>
              ))}
            </Section>
            </PlanLock>
            );
          })}
        </Modal>
      )}

      {open === "card" && (
        <Modal title="Button styles" onClose={() => setOpen(null)}>
          <DefaultTile selected={!design.card} onClick={() => pick({ card: undefined })} />
          {groupByCategory(CARD_STYLES).map(([cat, items]) => {
            const tier = cardCategoryTier(cat);
            const locked = PLAN_RANK[tier] > PLAN_RANK[plan];
            return (
              <PlanLock key={cat} locked={locked} tier="Pro">
                <Section title={cat} cols={3}>
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
                </Section>
              </PlanLock>
            );
          })}
        </Modal>
      )}

      {open === "buttonShape" && (
        <Modal title="Button shape" onClose={() => setOpen(null)}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BUTTON_SHAPES.map((o) => {
              const locked = PLAN_RANK[shapeTier(o.id)] > PLAN_RANK[plan];
              return (
                <PlanLock key={o.id} locked={locked}>
                  <button
                    onClick={() => pick({ buttonShape: o.id })}
                    className={cn(
                      "flex h-12 w-full items-center justify-center rounded-xl border text-sm",
                      design.buttonShape === o.id
                        ? "border-primary text-text"
                        : "border-border text-text-muted hover:text-text",
                    )}
                  >
                    {o.name}
                  </button>
                </PlanLock>
              );
            })}
          </div>
        </Modal>
      )}
      {open === "buttonSize" && (
        <ChoiceModal
          title="Button size"
          options={BUTTON_SIZES}
          selected={design.buttonSize}
          onPick={(id) => pick({ buttonSize: id })}
          onClose={() => setOpen(null)}
        />
      )}
      {open === "contentWidth" && (
        <ChoiceModal
          title="Content width"
          options={CONTENT_WIDTHS}
          selected={design.contentWidth}
          onPick={(id) => pick({ contentWidth: id })}
          onClose={() => setOpen(null)}
        />
      )}
      {open === "spacing" && (
        <ChoiceModal
          title="Spacing"
          options={SPACINGS}
          selected={design.spacing}
          onPick={(id) => pick({ spacing: id })}
          onClose={() => setOpen(null)}
        />
      )}
      {open === "motionSpeed" && (
        <ChoiceModal
          title="Motion speed"
          options={MOTION_SPEEDS}
          selected={design.motionSpeed}
          onPick={(id) => pick({ motionSpeed: id })}
          onClose={() => setOpen(null)}
        />
      )}
      {open === "textScale" && (
        <ChoiceModal
          title="Text size"
          options={TEXT_SCALES}
          selected={design.textScale}
          onPick={(id) => pick({ textScale: id })}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}

function ThemeGrid({
  themes,
  design,
  onChange,
}: {
  themes: FullTheme[];
  design: PageDesign;
  onChange: (patch: Partial<PageDesign>) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {themes.map((t) => {
        const active =
          design.accent === t.accent && design.background === t.design.background;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.design)}
            className="group shrink-0 text-center"
            title={`${t.name} — full profile: palette, buttons, font, animations & effects`}
          >
            <span
              className={cn(
                "block h-12 w-12 overflow-hidden rounded-xl border",
                active ? "border-primary" : "border-border",
              )}
              style={{ background: fullThemeSwatch(t) }}
            >
              <span
                className="block h-full w-full"
                style={{ boxShadow: `inset 0 -16px 16px -10px ${t.accent}` }}
              />
            </span>
            <span className="mt-1 block w-12 truncate text-[10px] text-text-muted">
              {t.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ChoiceModal({
  title,
  options,
  selected,
  onPick,
  onClose,
}: {
  title: string;
  options: { id: string; name: string }[];
  selected?: string;
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onPick(o.id)}
            className={cn(
              "flex h-12 items-center justify-center rounded-xl border text-sm",
              selected === o.id ? "border-primary text-text" : "border-border text-text-muted hover:text-text",
            )}
          >
            {o.name}
          </button>
        ))}
      </div>
    </Modal>
  );
}

function MiniRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-start gap-0.5 rounded-xl border border-border bg-surface-2 px-3 py-2 text-left transition-colors hover:border-primary/50"
    >
      <span className="text-[11px] text-text-muted">{label}</span>
      <span className="flex w-full items-center justify-between gap-1">
        <span className="truncate text-sm text-text">{value}</span>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-text-muted" />
      </span>
    </button>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-t-3xl border border-border bg-bg sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <p className="font-display text-base font-medium">{title}</p>
          <button onClick={onClose} aria-label="Close" className="text-text-muted hover:text-text">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function Section({
  title,
  cols = 5,
  children,
}: {
  title: string;
  cols?: 3 | 4 | 5;
  children: React.ReactNode;
}) {
  const gridCols =
    cols === 3 ? "grid-cols-3" : cols === 4 ? "grid-cols-4" : "grid-cols-3 sm:grid-cols-5";
  return (
    <section className="mb-5">
      <p className="mb-2 text-xs font-medium tracking-wide text-text-muted uppercase">{title}</p>
      <div className={cn("grid gap-2", gridCols)}>{children}</div>
    </section>
  );
}

function DefaultTile({ selected, onClick }: { selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "mb-5 flex h-11 w-full items-center justify-center rounded-xl border text-sm",
        selected ? "border-primary text-text" : "border-border text-text-muted hover:text-text",
      )}
    >
      Default
    </button>
  );
}
