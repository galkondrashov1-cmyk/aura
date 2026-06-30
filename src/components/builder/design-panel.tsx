"use client";

import { useState } from "react";
import { X, ChevronRight, Star, Wand2, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PageDesign } from "@/lib/blocks";
import {
  BACKGROUNDS,
  CARD_STYLES,
  BUTTON_IDLE,
  ICON_IDLE,
  ICON_FX,
  BG_FX,
  COLOR_PRESETS,
  FULL_THEMES,
  fullThemeSwatch,
  BUTTON_SHAPES,
  BUTTON_SIZES,
  CONTENT_WIDTHS,
  SPACINGS,
  TEXT_SCALES,
  accentFromBackground,
  groupByCategory,
} from "@/lib/design";
import { FONTS } from "@/lib/fonts";

type Picker =
  | "background"
  | "bgFx"
  | "card"
  | "buttonIdle"
  | "iconIdle"
  | "iconFx"
  | "font"
  | "buttonShape"
  | "buttonSize"
  | "contentWidth"
  | "spacing"
  | "textScale";

export function DesignPanel({
  design,
  onChange,
}: {
  design: PageDesign;
  onChange: (patch: Partial<PageDesign>) => void;
}) {
  const [open, setOpen] = useState<Picker | null>(null);

  const names = {
    background: BACKGROUNDS.find((b) => b.id === design.background)?.name ?? "Default",
    bgFx: BG_FX.find((e) => e.id === design.bgFx)?.name ?? "None",
    card: CARD_STYLES.find((c) => c.id === design.card)?.name ?? "Default",
    buttonIdle: BUTTON_IDLE.find((e) => e.id === design.buttonIdle)?.name ?? "None",
    iconIdle: ICON_IDLE.find((e) => e.id === design.iconIdle)?.name ?? "None",
    iconFx: ICON_FX.find((e) => e.id === design.iconFx)?.name ?? "Default",
    font: FONTS.find((f) => f.id === design.font)?.name ?? "Default",
    buttonShape: BUTTON_SHAPES.find((s) => s.id === design.buttonShape)?.name ?? "Pill",
    buttonSize: BUTTON_SIZES.find((s) => s.id === design.buttonSize)?.name ?? "Medium",
    contentWidth: CONTENT_WIDTHS.find((s) => s.id === design.contentWidth)?.name ?? "Standard",
    spacing: SPACINGS.find((s) => s.id === design.spacing)?.name ?? "Cozy",
    textScale: TEXT_SCALES.find((s) => s.id === design.textScale)?.name ?? "Normal",
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

      {/* One-click full themes */}
      <div className="mb-3">
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-xs text-text-muted">One-click themes</p>
          <button
            type="button"
            onClick={() => {
              const t = FULL_THEMES[Math.floor(Math.random() * FULL_THEMES.length)];
              onChange(t.design);
            }}
            className="flex items-center gap-1 rounded-lg border border-border bg-surface-2 px-2 py-1 text-[11px] text-text-muted transition-colors hover:border-primary/50 hover:text-text"
          >
            <Shuffle className="h-3 w-3" /> Surprise me
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {FULL_THEMES.map((t) => {
            const active = design.accent === t.accent && design.background === t.design.background;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onChange(t.design)}
                className="group shrink-0 text-center"
                title={`${t.name} — sets background, color, buttons, font & effects`}
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
                <span className="mt-1 block w-12 truncate text-[10px] text-text-muted">{t.name}</span>
              </button>
            );
          })}
        </div>
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

      {/* Accent color + match */}
      <div className="mb-3">
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-xs text-text-muted">Accent color</p>
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
            aria-label="Accent color"
          />
          <button
            type="button"
            onClick={matchAccent}
            disabled={!design.background}
            title={design.background ? "Match accent to background" : "Pick a background first"}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 text-xs text-text-muted transition-colors hover:border-primary/50 hover:text-text disabled:opacity-40"
          >
            <Wand2 className="h-3.5 w-3.5" /> Match
          </button>
          <span className="ml-auto truncate text-xs text-text-muted">
            {design.accent ?? "Default"}
          </span>
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
      </div>

      {/* Buttons (page defaults — override any single button in its block) */}
      <p className="mt-3 mb-1.5 text-xs text-text-muted">
        Buttons <span className="text-text-muted/60">· defaults (override per button in its block)</span>
      </p>
      <div className="grid grid-cols-2 gap-2">
        <MiniRow label="Style" value={names.card} onClick={() => setOpen("card")} />
        <MiniRow label="Shape" value={names.buttonShape} onClick={() => setOpen("buttonShape")} />
        <MiniRow label="Size" value={names.buttonSize} onClick={() => setOpen("buttonSize")} />
        <MiniRow label="Idle motion" value={names.buttonIdle} onClick={() => setOpen("buttonIdle")} />
      </div>

      {/* Icons */}
      <p className="mt-3 mb-1.5 text-xs text-text-muted">Icons</p>
      <div className="grid grid-cols-2 gap-2">
        <MiniRow label="Idle motion" value={names.iconIdle} onClick={() => setOpen("iconIdle")} />
        <MiniRow label="Hover effect" value={names.iconFx} onClick={() => setOpen("iconFx")} />
      </div>

      {open === "font" && (
        <Modal title="Fonts" onClose={() => setOpen(null)}>
          <DefaultTile selected={!design.font} onClick={() => pick({ font: undefined })} />
          {groupByCategory(FONTS).map(([cat, items]) => (
            <Section key={cat} title={cat} cols={3}>
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
          ))}
        </Modal>
      )}

      {open === "background" && (
        <Modal title="Backgrounds" onClose={() => setOpen(null)}>
          <DefaultTile selected={!design.background} onClick={() => pick({ background: undefined })} />
          {groupByCategory(BACKGROUNDS).map(([cat, items]) => (
            <Section key={cat} title={cat}>
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
          ))}
        </Modal>
      )}

      {open === "bgFx" && (
        <Modal title="Background effects" onClose={() => setOpen(null)}>
          {groupByCategory(BG_FX).map(([cat, items]) => (
            <Section key={cat} title={cat} cols={3}>
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
          ))}
        </Modal>
      )}

      {open === "card" && (
        <PillModal
          title="Button styles"
          options={CARD_STYLES}
          selected={design.card}
          onPick={(id) => pick({ card: id })}
          onDefault={() => pick({ card: undefined })}
          onClose={() => setOpen(null)}
        />
      )}
      {open === "buttonIdle" && (
        <PillModal
          title="Button idle animations"
          options={BUTTON_IDLE}
          selected={design.buttonIdle}
          onPick={(id) => pick({ buttonIdle: id })}
          onDefault={() => pick({ buttonIdle: undefined })}
          onClose={() => setOpen(null)}
        />
      )}
      {open === "iconIdle" && (
        <IconModal
          title="Icon idle animations"
          options={ICON_IDLE}
          selected={design.iconIdle}
          onPick={(id) => pick({ iconIdle: id })}
          onDefault={() => pick({ iconIdle: undefined })}
          onClose={() => setOpen(null)}
        />
      )}
      {open === "iconFx" && (
        <IconModal
          title="Icon hover effects"
          options={ICON_FX}
          selected={design.iconFx}
          onPick={(id) => pick({ iconFx: id })}
          onDefault={() => pick({ iconFx: undefined })}
          onClose={() => setOpen(null)}
        />
      )}

      {open === "buttonShape" && (
        <ChoiceModal
          title="Button shape"
          options={BUTTON_SHAPES}
          selected={design.buttonShape}
          onPick={(id) => pick({ buttonShape: id })}
          onClose={() => setOpen(null)}
        />
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

type Opt = { id: string; name: string; category: string; className: string };

function PillModal({
  title,
  options,
  selected,
  onPick,
  onDefault,
  onClose,
}: {
  title: string;
  options: Opt[];
  selected?: string;
  onPick: (id: string) => void;
  onDefault: () => void;
  onClose: () => void;
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <DefaultTile selected={!selected} onClick={onDefault} />
      {groupByCategory(options).map(([cat, items]) => (
        <Section key={cat} title={cat} cols={3}>
          {items.map((o) => (
            <button
              key={o.id}
              onClick={() => onPick(o.id)}
              className={cn("rounded-xl border p-2", selected === o.id ? "border-primary" : "border-border")}
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
      ))}
    </Modal>
  );
}

function IconModal({
  title,
  options,
  selected,
  onPick,
  onDefault,
  onClose,
}: {
  title: string;
  options: Opt[];
  selected?: string;
  onPick: (id: string) => void;
  onDefault: () => void;
  onClose: () => void;
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <DefaultTile selected={!selected} onClick={onDefault} />
      {groupByCategory(options).map(([cat, items]) => (
        <Section key={cat} title={cat} cols={4}>
          {items.map((o) => (
            <button
              key={o.id}
              onClick={() => onPick(o.id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border p-3 text-xs text-text-muted",
                selected === o.id ? "border-primary" : "border-border",
              )}
            >
              <Star className={cn("h-5 w-5 text-primary", o.className)} />
              {o.name}
            </button>
          ))}
        </Section>
      ))}
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
