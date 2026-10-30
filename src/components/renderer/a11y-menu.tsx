"use client";

import { useEffect, useRef, useState } from "react";
import { Accessibility, X } from "lucide-react";
import type { Lang } from "@/lib/i18n";

type Prefs = { text: number; contrast: boolean; links: boolean; still: boolean; font: boolean };
const NONE: Prefs = { text: 0, contrast: false, links: false, still: false, font: false };
const KEY = "pg-a11y";

const T = {
  he: { open: "תפריט נגישות", title: "נגישות", text: "הגדלת טקסט", contrast: "ניגודיות גבוהה", links: "הדגשת קישורים", still: "עצירת אנימציות", font: "גופן קריא", reset: "איפוס" },
  en: { open: "Accessibility menu", title: "Accessibility", text: "Larger text", contrast: "High contrast", links: "Highlight links", still: "Stop animations", font: "Readable font", reset: "Reset" },
};

/**
 * Visitor-facing accessibility menu (common on Israeli business sites, where
 * accessibility is a legal duty). Preferences apply to this page only and are
 * remembered in the visitor's browser.
 */
export function A11yMenu({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [open, setOpen] = useState(false);
  const [p, setP] = useState<Prefs>(NONE);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (saved) requestAnimationFrame(() => setP({ ...NONE, ...saved }));
    } catch {
      /* storage blocked — defaults */
    }
  }, []);

  useEffect(() => {
    const pg = root.current?.closest<HTMLElement>(".pg");
    if (!pg) return;
    pg.dataset.a11yContrast = p.contrast ? "1" : "";
    pg.dataset.a11yLinks = p.links ? "1" : "";
    pg.dataset.a11yStill = p.still ? "1" : "";
    pg.dataset.a11yFont = p.font ? "1" : "";
    document.documentElement.style.fontSize = p.text ? `${100 + p.text * 15}%` : "";
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch {
      /* storage blocked */
    }
  }, [p]);

  const toggle = (k: Exclude<keyof Prefs, "text">) => setP((x) => ({ ...x, [k]: !x[k] }));
  const opts: [Exclude<keyof Prefs, "text">, string][] = [
    ["contrast", t.contrast],
    ["links", t.links],
    ["still", t.still],
    ["font", t.font],
  ];

  return (
    <div ref={root} className="a11y">
      {open && (
        <div role="dialog" aria-label={t.title} className="a11y-panel">
          <div className="flex items-center justify-between">
            <p className="font-medium">{t.title}</p>
            <button onClick={() => setOpen(false)} aria-label="✕">
              <X className="h-4 w-4" />
            </button>
          </div>
          <button aria-pressed={p.text > 0} onClick={() => setP((x) => ({ ...x, text: (x.text + 1) % 3 }))}>
            {t.text} {p.text ? `(${100 + p.text * 15}%)` : ""}
          </button>
          {opts.map(([k, label]) => (
            <button key={k} aria-pressed={p[k]} onClick={() => toggle(k)}>
              {label}
            </button>
          ))}
          <button onClick={() => setP(NONE)} className="a11y-reset">
            {t.reset}
          </button>
        </div>
      )}
      <button className="a11y-fab" aria-label={t.open} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Accessibility className="h-6 w-6" />
      </button>
    </div>
  );
}
