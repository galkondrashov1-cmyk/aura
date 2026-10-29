import { Check, Minus } from "lucide-react";
import { planMatrix, type Cell } from "@/lib/plan-matrix";
import { PLANS, type Plan } from "@/lib/plans";
import { cn } from "@/lib/utils";

function CellView({ value }: { value: Cell }) {
  if (value === true) return <Check className="mx-auto h-4 w-4 text-primary-text" aria-label="כלול" />;
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-text-muted/40" aria-label="לא כלול" />;
  return <span className="text-xs text-text sm:text-sm">{value}</span>;
}

/** Every feature, every plan — generated from the real feature data. */
export function PlanComparison({ highlight }: { highlight?: Plan }) {
  const groups = planMatrix();
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <table className="w-full table-fixed border-collapse text-start">
        <caption className="sr-only">מה כוללת כל חבילה</caption>
        <colgroup>
          <col className="w-[43%] sm:w-[52%]" />
          <col />
          <col />
          <col />
        </colgroup>
        <thead className="sticky top-0 z-10 bg-surface/95 backdrop-blur">
          <tr className="border-b border-border">
            <th scope="col" className="px-3 py-3 text-xs font-medium text-text-muted sm:px-5">
              יכולת
            </th>
            {PLANS.map((p) => (
              <th
                key={p.id}
                scope="col"
                className={cn("px-1 py-3 text-center font-display text-sm font-medium", highlight === p.id && "text-primary-text")}
              >
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        {groups.map((g) => (
          <tbody key={g.title}>
            <tr>
              <th colSpan={4} scope="colgroup" className="bg-surface-2/60 px-3 py-2 text-[11px] font-semibold tracking-wider text-text-muted uppercase sm:px-5">
                {g.title}
              </th>
            </tr>
            {g.rows.map((r) => (
              <tr key={r.label} className="border-t border-border/60">
                <th scope="row" className="px-3 py-2.5 align-top text-sm font-normal text-text sm:px-5">
                  {r.label}
                  {r.hint && <span className="mt-0.5 block text-[11px] leading-snug text-text-muted">{r.hint}</span>}
                </th>
                {(["FREE", "PLUS", "PRO"] as const).map((p) => (
                  <td key={p} className={cn("px-1 py-2.5 text-center align-top", highlight === p && "bg-primary/5")}>
                    <CellView value={r.cells[p]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}

const FAQ: { q: string; a: string }[] = [
  {
    q: "זה באמת בחינם עכשיו?",
    a: "כן. בתקופת הגישה המוקדמת כל החבילות — כולל Plus ו־Pro — בחינם. לא תחויבו אף פעם אלא אם תירשמו למנוי בעצמכם.",
  },
  {
    q: "מה יקרה כשהחבילות בתשלום יתחילו?",
    a: "נודיע על כך באפליקציה הרבה מראש. מי שבגישה מוקדמת יקבל תקופת מעבר, ותבחרו אם להירשם למנוי. אם לא — העמוד פשוט יעבור לחבילה החינמית ויישאר באוויר.",
  },
  {
    q: "מה קורה לעמוד שלי אם אעבור לחבילה קטנה יותר?",
    a: "שום דבר לא נמחק. נגיעות פרימיום (למשל רקע חי או בלוק מחירון) מפסיקות להופיע בעמוד הציבורי ומתחלפות במראה החינמי הקרוב, ועמודים מעבר למגבלת החבילה יורדים מהאוויר — העמוד הראשי נשאר תמיד. משדרגים שוב, והכל חוזר בדיוק כמו שעיצבתם.",
  },
  {
    q: "אפשר לנסות יכולות פרימיום לפני שמחליטים?",
    a: "כן — כל אפקט עובד בעורך בכל חבילה. העורך מראה בבירור אילו מהם יופיעו בעמוד החי רק עם Plus או Pro.",
  },
  {
    q: "שנתי או חודשי?",
    a: "אותן יכולות. בשנתי המחיר החודשי נמוך יותר; בחודשי אפשר לבטל מתי שרוצים. בשני המקרים הגישה נשמרת עד סוף התקופה ששולמה.",
  },
  {
    q: "יש תמיכה בעברית?",
    a: "בכל החבילות: פונטים בעברית, עמודים מימין לשמאל אוטומטית, וגם הטקסטים למבקרים (טפסים, כפתורים, ספירה לאחור) בעברית.",
  },
];

export function PricingFaq() {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
      {FAQ.map((f) => (
        <details key={f.q} className="group px-5 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium">
            {f.q}
            <span className="text-text-muted transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
