"use client";

// A small rich-text field: type text and color any selection (or set a color and
// keep typing) — down to a single letter. Produces structured runs, not HTML.
import { useEffect, useRef, useState } from "react";
import { Baseline } from "lucide-react";
import { cn } from "@/lib/utils";
import { runsToHtml } from "@/lib/richtext";
import type { RichValue, TextRun } from "@/lib/richtext";

const QUICK = [
  "#ffffff",
  "#0a0a0a",
  "#ef4444",
  "#f59e0b",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
];

function htmlToRuns(root: HTMLElement): TextRun[] {
  const runs: TextRun[] = [];
  const push = (text: string, color?: string) => {
    if (text) runs.push(color ? { text, color } : { text });
  };
  const walk = (node: Node, color?: string) => {
    if (node.nodeType === Node.TEXT_NODE) {
      push(node.textContent ?? "", color);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    if (tag === "br") {
      runs.push({ text: "\n" });
      return;
    }
    let c = color;
    const sc = el.style?.color;
    if (sc) c = sc;
    const block = tag === "div" || tag === "p";
    if (block && runs.length && runs[runs.length - 1].text.slice(-1) !== "\n") {
      runs.push({ text: "\n" });
    }
    el.childNodes.forEach((ch) => walk(ch, c));
  };
  root.childNodes.forEach((n) => walk(n));
  // merge adjacent runs that share a color
  const merged: TextRun[] = [];
  for (const r of runs) {
    const last = merged[merged.length - 1];
    if (last && last.color === r.color) last.text += r.text;
    else merged.push({ ...r });
  }
  if (merged.length && merged[merged.length - 1].text === "\n") merged.pop();
  return merged;
}

export function RichTextInput({
  value,
  onChange,
  placeholder,
  multiline = false,
  className,
}: {
  value?: RichValue;
  onChange: (v: TextRun[]) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState("#ef4444");

  // Initialize the editable surface once from the stored value.
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = runsToHtml(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = () => {
    if (ref.current) onChange(htmlToRuns(ref.current));
  };

  const applyColor = (c: string) => {
    setColor(c);
    const el = ref.current;
    if (!el) return;
    el.focus();
    // Color the current selection; if nothing is selected this sets the color
    // for the next characters typed.
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand("foreColor", false, c);
    emit();
  };

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="flex items-center gap-1 text-[11px] text-text-muted">
          <Baseline className="h-3 w-3" /> Color
        </span>
        {QUICK.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => applyColor(c)}
            className="h-5 w-5 rounded-full border border-border"
            style={{ background: c }}
            aria-label={`Color ${c}`}
          />
        ))}
        <input
          type="color"
          value={color}
          onChange={(e) => applyColor(e.target.value)}
          className="h-6 w-7 cursor-pointer rounded border border-border bg-surface-2"
          aria-label="Custom color"
        />
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        onKeyDown={(e) => {
          if (!multiline && e.key === "Enter") e.preventDefault();
        }}
        data-placeholder={placeholder}
        className={cn(
          "rich-input w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          multiline ? "min-h-[4.5rem]" : "min-h-9",
          className,
        )}
      />
    </div>
  );
}
