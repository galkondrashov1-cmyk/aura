import type { Metadata } from "next";
import { SiteNav, CtaBand, Footer } from "@/components/marketing";
import { UpgradePlans } from "@/components/upgrade/plans";
import { PlanComparison, PricingFaq } from "@/components/upgrade/comparison";

export const metadata: Metadata = {
  title: "Pricing — AURA",
  description:
    "Free forever for a beautiful page. Plus and Pro unlock the full design studio, business blocks and more pages — every plan is free during early access.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="min-h-dvh">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-14 sm:px-6 md:pt-14">
        <p className="text-sm font-medium text-primary">Pricing</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-medium tracking-tight md:text-5xl">
          A page nobody else has, for the price of one coffee a month.
        </h1>
        <p className="mt-4 max-w-2xl text-text-muted">
          Start free and stay free as long as you like. Upgrade when you want the whole design studio, business blocks or
          more pages. Everything below is generated from the actual product, so it&apos;s exactly what you get.
        </p>
        <div className="mt-10">
          <UpgradePlans mode="public" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">Everything, side by side</h2>
        <p className="mt-2 text-sm text-text-muted">
          Every effect works in the editor on every plan, so you can try before you decide.
        </p>
        <div className="mt-6">
          <PlanComparison />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">Questions</h2>
        <div className="mt-6">
          <PricingFaq />
        </div>
      </section>

      <CtaBand />
      <Footer />
    </div>
  );
}
