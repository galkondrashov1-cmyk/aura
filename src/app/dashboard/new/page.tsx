import { titled } from "@/lib/brand";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { effectivePlanFrom } from "@/lib/plan-source";
import { caps } from "@/lib/plans";
import { TemplateGallery } from "@/components/dashboard/template-gallery";
import { Wizard } from "@/components/wizard/wizard";

export const metadata = { title: titled("עמוד חדש") };

type Props = { searchParams: Promise<{ gallery?: string }> };

export default async function NewPage({ searchParams }: Props) {
  const user = await getSession();
  if (!user) redirect("/login");
  const plan = effectivePlanFrom(user);
  const pages = await prisma.page.count({ where: { userId: user.id } });
  // At the plan's page limit: say so now, not after five steps of answers.
  if (pages >= caps(plan).maxPages) redirect("/dashboard/upgrade?limit=pages");

  if ((await searchParams).gallery) {
    return (
      <div>
        <h1 className="text-[2rem] leading-tight font-semibold">כל התבניות</h1>
        <p className="mt-1 text-sm text-text-muted">
          עמודים מלאים עם תוכן לדוגמה. מעדיפים לענות על כמה שאלות?{" "}
          <Link href="/dashboard/new" className="text-text underline underline-offset-4">
            לבנייה מודרכת
          </Link>
        </p>
        <div className="mt-6">
          <TemplateGallery plan={plan} />
        </div>
      </div>
    );
  }

  const name = user.name?.trim() || "";
  return <Wizard plan={plan} username={user.username} first={pages === 0} defaultName={name} />;
}
