import { titled } from "@/lib/brand";
import type { Metadata } from "next";
import { SiteNav, CtaBand, Footer } from "@/components/marketing";
import { UpgradePlans } from "@/components/upgrade/plans";
import { PlanComparison, PricingFaq } from "@/components/upgrade/comparison";

export const metadata: Metadata = {
  title: titled("מחירים"),
  description:
    "עמוד יפהפה בחינם לתמיד. Plus ו־Pro פותחות את כל סטודיו העיצוב, בלוקים לעסקים ועוד עמודים — וכל החבילות בחינם בגישה המוקדמת.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="min-h-dvh">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-14 sm:px-6 md:pt-14">
        <h1 className="display-l max-w-3xl">מחירים</h1>
        <p className="mt-4 max-w-2xl text-text-muted">
          מתחילים בחינם ונשארים בחינם כמה שרוצים. משדרגים כשרוצים את כל סטודיו העיצוב, בלוקים לעסקים או עוד עמודים.
          כל מה שמופיע כאן נוצר ישירות מהמוצר, כך שזה בדיוק מה שתקבלו.
        </p>
        <div className="mt-10">
          <UpgradePlans mode="public" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="font-display text-[2rem] leading-tight font-bold tracking-tight md:text-3xl">הכל, זה לצד זה</h2>
        <p className="mt-2 text-sm text-text-muted">
          כל אפקט עובד בעורך בכל חבילה, כך שאפשר לנסות לפני שמחליטים.
        </p>
        <div className="mt-6">
          <PlanComparison />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <h2 className="font-display text-[2rem] leading-tight font-bold tracking-tight md:text-3xl">שאלות נפוצות</h2>
        <div className="mt-6">
          <PricingFaq />
        </div>
      </section>

      <CtaBand />
      <Footer />
    </div>
  );
}
