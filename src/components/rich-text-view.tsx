// Renders rich text runs safely: React escapes each run's text and we only ever
// apply a color that passes validation. Server-component friendly (no hooks).
import { toRuns, isSafeColor } from "@/lib/richtext";
import type { RichValue } from "@/lib/richtext";

export function RichTextView({
  value,
  className,
}: {
  value?: RichValue;
  className?: string;
}) {
  const runs = toRuns(value);
  return (
    <span className={className} style={{ whiteSpace: "pre-line" }}>
      {runs.map((r, i) =>
        isSafeColor(r.color) ? (
          <span key={i} style={{ color: r.color }}>
            {r.text}
          </span>
        ) : (
          <span key={i}>{r.text}</span>
        ),
      )}
    </span>
  );
}
