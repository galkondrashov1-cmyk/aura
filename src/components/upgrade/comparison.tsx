import { Check, Minus } from "lucide-react";
import { planMatrix, type Cell } from "@/lib/plan-matrix";
import { PLANS, type Plan } from "@/lib/plans";
import { cn } from "@/lib/utils";

function CellView({ value }: { value: Cell }) {
  if (value === true) return <Check className="mx-auto h-4 w-4 text-primary" aria-label="Included" />;
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-text-muted/40" aria-label="Not included" />;
  return <span className="text-xs text-text sm:text-sm">{value}</span>;
}

/** Every feature, every plan — generated from the real feature data. */
export function PlanComparison({ highlight }: { highlight?: Plan }) {
  const groups = planMatrix();
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface">
      <table className="w-full table-fixed border-collapse text-left">
        <caption className="sr-only">What each AURA plan includes</caption>
        <colgroup>
          <col className="w-[43%] sm:w-[52%]" />
          <col />
          <col />
          <col />
        </colgroup>
        <thead className="sticky top-0 z-10 bg-surface/95 backdrop-blur">
          <tr className="border-b border-border">
            <th scope="col" className="px-3 py-3 text-xs font-medium text-text-muted sm:px-5">
              Feature
            </th>
            {PLANS.map((p) => (
              <th
                key={p.id}
                scope="col"
                className={cn("px-1 py-3 text-center font-display text-sm font-medium", highlight === p.id && "text-primary")}
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
    q: "Is it really free right now?",
    a: "Yes. During early access every plan — including Plus and Pro — is free. Nothing is ever charged unless you subscribe yourself.",
  },
  {
    q: "What happens when paid plans start?",
    a: "We'll announce it in the app well in advance. Early-access plans get a grace period, and you choose whether to subscribe. If you don't, your page simply moves to the Free plan — it stays online.",
  },
  {
    q: "What happens to my page if I move to a smaller plan?",
    a: "Nothing is deleted. Premium touches (say, a live background or a pricing block) stop showing on your public page and switch to their closest free look, and pages beyond your plan's limit go offline — your main page always stays up. Upgrade again and everything is back exactly as you designed it.",
  },
  {
    q: "Can I try premium features before deciding?",
    a: "Yes — every effect works in the editor on any plan. The editor tells you clearly which ones will only appear on your live page with Plus or Pro.",
  },
  {
    q: "Yearly or monthly?",
    a: "Same features. Yearly costs less per month; monthly lets you cancel any time. Either way you keep access until the end of the period you paid for.",
  },
  {
    q: "Do you support Hebrew?",
    a: "On every plan: ten Hebrew fonts, automatic right-to-left pages, and visitor-facing text (forms, buttons, countdowns) in Hebrew.",
  },
];

export function PricingFaq() {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface">
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
