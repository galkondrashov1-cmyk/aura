import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getEffectivePlan } from "@/lib/plan-source";
import { TemplateGallery } from "@/components/dashboard/template-gallery";

export const metadata = { title: "New page · AURA" };

export default async function NewPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const plan = await getEffectivePlan(user.id);
  return (
    <div>
      <h1 className="font-display text-2xl font-medium tracking-tight">Pick a starting point</h1>
      <p className="mt-1 text-sm text-text-muted">
        Every template is fully editable — swap the words, then Remix the look until it&apos;s unmistakably yours.
      </p>
      <div className="mt-6">
        <TemplateGallery plan={plan} />
      </div>
    </div>
  );
}
