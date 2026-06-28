// Rich text model for per-character text color.
//
// Instead of storing arbitrary HTML (a stored-XSS risk on public pages), text is
// stored as an array of "runs" — { text, color } segments. The renderer prints
// each run with React (which escapes the text) and only applies a color that
// passes `isSafeColor`. A plain string is also accepted for backwards-compat and
// for any text that was never colored.

export type TextRun = { text: string; color?: string };
export type RichValue = string | TextRun[];

const SAFE_COLOR =
  /^(#[0-9a-fA-F]{3,8}|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0|1|0?\.\d+)\s*)?\)|hsla?\(\s*\d{1,3}(\.\d+)?\s*,\s*\d{1,3}(\.\d+)?%\s*,\s*\d{1,3}(\.\d+)?%\s*(,\s*(0|1|0?\.\d+)\s*)?\))$/;

export function isSafeColor(c?: string): c is string {
  return typeof c === "string" && SAFE_COLOR.test(c.trim());
}

/** Normalize any stored value into validated runs. */
export function toRuns(value: RichValue | undefined | null): TextRun[] {
  if (value == null) return [];
  if (typeof value === "string") return value ? [{ text: value }] : [];
  if (Array.isArray(value)) {
    return value
      .filter((r): r is TextRun => !!r && typeof r.text === "string" && r.text.length > 0)
      .map((r) => (isSafeColor(r.color) ? { text: r.text, color: r.color } : { text: r.text }));
  }
  return [];
}

/** Plain-text projection — for alt text, titles, SEO, comparisons. */
export function toPlain(value: RichValue | undefined | null): string {
  return toRuns(value)
    .map((r) => r.text)
    .join("");
}

export function isEmptyRich(value: RichValue | undefined | null): boolean {
  return toPlain(value).trim() === "";
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Build the initial innerHTML for the contentEditable editor from runs. Safe:
 * text is escaped and colors are validated, so this never injects markup.
 */
export function runsToHtml(value: RichValue | undefined | null): string {
  const runs = toRuns(value);
  if (!runs.length) return "";
  return runs
    .map((r) => {
      const html = esc(r.text).replace(/\n/g, "<br>");
      return isSafeColor(r.color) ? `<span style="color: ${r.color}">${html}</span>` : html;
    })
    .join("");
}
