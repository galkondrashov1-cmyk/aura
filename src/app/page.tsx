import Link from "next/link";
import { Camera, Video, Music2 } from "lucide-react";
import { AuraMark } from "@/components/aura-logo";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SiteNav,
  Features,
  HowItWorks,
  Testimonials,
  CtaBand,
  Footer,
} from "@/components/marketing";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="aura-backdrop">
        <SiteNav />

        <main className="mx-auto max-w-6xl px-6">
          <section className="flex flex-col items-center pt-20 pb-16 text-center md:pt-28">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-text-muted">
              <span className="aura-glow h-1.5 w-1.5 rounded-full bg-primary" />
              Early access
            </span>

            <h1 className="font-display max-w-3xl text-4xl leading-[1.05] font-medium tracking-tight md:text-6xl">
              Your link in bio,{" "}
              <span
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, var(--primary), var(--accent))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                reimagined
              </span>{" "}
              as a website.
            </h1>

            <p className="mt-6 max-w-xl text-base text-text-muted md:text-lg">
              AURA is the most beautiful way to build a personal page. Stunning,
              premium mini-sites for creators, founders, and anyone with
              something to share — no code, ready in minutes.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
              <Link href="/signup" className={buttonClasses("primary", "lg")}>
                Create your AURA
              </Link>
              <Link href="/login" className={buttonClasses("secondary", "lg")}>
                Log in
              </Link>
            </div>

            <p className="mt-5 text-sm text-text-muted">
              useaura.me/<span className="text-text">yourname</span>
            </p>
          </section>

          <section className="pb-16">
            <HeroMock />
          </section>
        </main>
      </div>

      <Features />
      <HowItWorks />
      <Testimonials />
      <CtaBand />
      <Footer />
    </div>
  );
}

function HeroMock() {
  const links = [
    { label: "Book a free session", primary: true },
    { label: "Watch my program", primary: false },
    { label: "Join the newsletter", primary: false },
  ];
  return (
    <div className="mx-auto max-w-sm">
      <div className="aura-glow rounded-[28px] border border-border bg-surface p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 grid h-20 w-20 place-items-center rounded-full bg-surface-2 text-primary">
            <AuraMark className="h-9 w-9" />
          </div>
          <p className="font-display text-lg font-medium">Maya Rivera</p>
          <p className="text-sm text-text-muted">Fitness coach · online training</p>

          <div className="mt-6 w-full space-y-2.5">
            {links.map((l) => (
              <div
                key={l.label}
                className={cn(
                  "flex h-12 items-center justify-center rounded-full text-sm font-medium",
                  l.primary
                    ? "aura-glow bg-primary text-primary-ink"
                    : "border border-border bg-surface-2 text-text",
                )}
              >
                {l.label}
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-5 text-text-muted">
            <Camera className="h-5 w-5" />
            <Video className="h-5 w-5" />
            <Music2 className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
