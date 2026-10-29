import { titled } from "@/lib/brand";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { effectivePlanFrom } from "@/lib/plan-source";
import { TemplateGallery } from "@/components/dashboard/template-gallery";

export const metadata = { title: titled("עמוד חדש") };

export default async function NewPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const plan = effectivePlanFrom(user);
  return (
    <div>
      <h1 className="font-display text-[2rem] leading-tight font-black tracking-tight">בחרו נקודת התחלה</h1>
      <p className="mt-1 text-sm text-text-muted">
        כל תבנית ניתנת לעריכה מלאה — החליפו את הטקסטים, ואז עשו Remix עד שהמראה יהיה בדיוק שלכם.
      </p>
      <div className="mt-6">
        <TemplateGallery plan={plan} />
      </div>
    </div>
  );
}
