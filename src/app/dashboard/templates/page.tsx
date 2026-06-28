import { PageRenderer } from "@/components/renderer/page-renderer";
import { buttonClasses } from "@/components/ui/button";
import { templates } from "@/lib/templates";
import { createPage } from "@/lib/actions/pages";

export default function TemplatesPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-medium tracking-tight">Templates</h1>
      <p className="mt-1 text-sm text-text-muted">
        Pick a starting point — you can customize everything after.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <div className="h-56 overflow-hidden border-b border-border">
              <div className="pointer-events-none origin-top scale-[0.78]">
                <PageRenderer content={tpl.content} embedded />
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="font-display text-base font-medium">{tpl.name}</p>
              <p className="mt-1 flex-1 text-sm text-text-muted">{tpl.description}</p>
              <form action={createPage.bind(null, tpl.id)} className="mt-4">
                <button type="submit" className={buttonClasses("primary", "sm", "w-full")}>
                  Use this template
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
