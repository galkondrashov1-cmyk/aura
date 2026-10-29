import { catLabel } from "@/lib/design";
import { ArrowRight, Plus } from "lucide-react";
import { createPage } from "@/lib/actions/pages";
import { TEMPLATES, templateContent } from "@/lib/templates";
import { PLAN_RANK, type Plan } from "@/lib/plans";
import { PageThumb } from "./page-thumb";

/** Every starter template, live-rendered. One tap creates a page from it. */
export function TemplateGallery({ plan }: { plan: Plan }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <form action={createPage}>
        <input type="hidden" name="template" value="blank" />
        <button
          type="submit"
          className="group flex h-full min-h-[340px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface/40 p-6 text-center transition-colors hover:border-primary/60"
        >
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-surface-2 text-primary-text transition-transform group-hover:scale-110">
            <Plus className="h-6 w-6" />
          </span>
          <span className="font-display text-base font-medium">להתחיל מאפס</span>
          <span className="max-w-[16rem] text-sm text-text-muted">עמוד נקי עם השם שלכם בלבד — בונים אותו בלוק אחרי בלוק.</span>
        </button>
      </form>
      {TEMPLATES.map((t) => {
        const premium = PLAN_RANK[t.tier] > PLAN_RANK[plan];
        // The live thumbnail contains its own links/forms, so it can't sit
        // inside the submit button — a full-card overlay button sits beside it.
        return (
          <div
            key={t.id}
            className="group relative overflow-hidden rounded-xl border border-border bg-surface text-start transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-2xl"
          >
            <PageThumb content={templateContent(t.id)} className="h-64" />
            <div className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="flex items-center gap-2">
                  <span className="font-display text-base font-medium text-text">{t.name}</span>
                  <span className="text-[11px] text-text-muted">{catLabel(t.category)}</span>
                </p>
                <p className="mt-0.5 text-xs text-text-muted">{t.description}</p>
                {premium && (
                  <p className="mt-1.5 text-[11px] text-primary-text">
                    כולל אפקטים של {t.tier === "PRO" ? "Pro" : "Plus"} — נסו אותם בחינם בעורך
                  </p>
                )}
              </div>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-text-muted transition-colors group-hover:bg-primary group-hover:text-primary-ink">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
            <form action={createPage} className="absolute inset-0">
              <input type="hidden" name="template" value={t.id} />
              <button type="submit" aria-label={`שימוש בתבנית ${t.name}`} className="absolute inset-0 cursor-pointer" />
            </form>
          </div>
        );
      })}
    </div>
  );
}
