import Link from "next/link";
import { Camera, Play, Music2, Brush } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SiteNav, FeatureRows, HowItWorks, CtaBand, Footer } from "@/components/marketing";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="aura-backdrop">
        <SiteNav />

        <main className="mx-auto max-w-6xl px-6">
          <section className="grid items-center gap-12 pt-14 pb-16 md:pt-20 lg:grid-cols-[1.05fr_1fr]">
            <div className="text-center lg:text-left">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-text-muted">
                <span className="aura-glow h-1.5 w-1.5 rounded-full bg-primary" />
                Early access — free while we grow
              </span>

              <h1 className="font-display text-4xl leading-[1.05] font-medium tracking-tight md:text-6xl">
                One link.{" "}
                <span
                  style={{
                    backgroundImage:
                      "linear-gradient(100deg, var(--primary), var(--accent))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Entirely
                </span>{" "}
                you.
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-base text-text-muted md:text-lg lg:mx-0">
                Most link-in-bio pages look like everyone else&apos;s. AURA gives you a
                real design studio — 18 hand-tuned themes, animated backgrounds,
                buttons with personality — so your page feels like <em>you</em>, not
                a template.
              </p>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <Link href="/signup" className={buttonClasses("primary", "lg")}>
                  Claim your page
                </Link>
                <p className="text-sm text-text-muted">
                  useaura.me/<span className="text-text">yourname</span> · no card, no code
                </p>
              </div>
            </div>

            <ProfileShowcase />
          </section>
        </main>
      </div>

      <FeatureRows />
      <HowItWorks />
      <CtaBand />
      <Footer />
    </div>
  );
}

/* Three fictional creators, each wearing a REAL AURA theme — this is the
   product, not an illustration. */
function ProfileShowcase() {
  return (
    <div className="relative mx-auto flex max-w-md items-stretch justify-center gap-3 lg:max-w-none">
      <MiniProfile
        className="mt-10 hidden -rotate-3 sm:flex"
        bg="radial-gradient(80% 55% at 50% 100%, hsl(316 85% 30%) 0%, transparent 60%), radial-gradient(50% 40% at 50% 88%, hsl(356 90% 38%) 0%, transparent 55%), linear-gradient(180deg, hsl(255 60% 8%) 0%, hsl(280 55% 12%) 60%, hsl(316 70% 14%) 100%)"
        accent="#F472B6"
        initials="LX"
        name="Leo Xander"
        tagline="DJ · club nights & mixes"
        links={["Tonight's set", "Bookings"]}
        icons={[Music2, Play]}
        sharp
      />
      <MiniProfile
        className="z-10 flex"
        bg="radial-gradient(at 20% 0%, hsl(158 75% 20%) 0, transparent 50%), radial-gradient(at 80% 12%, hsl(218 70% 18%) 0, transparent 45%), radial-gradient(at 50% 100%, hsl(278 70% 16%) 0, transparent 55%), #05060a"
        accent="#00E5A0"
        initials="MR"
        name="Maya Rivera"
        tagline="Fitness coach · online training"
        links={["Book a free session", "My program"]}
        icons={[Camera, Play]}
        glow
      />
      <MiniProfile
        className="mt-10 hidden rotate-3 sm:flex"
        bg="radial-gradient(60% 50% at 15% 15%, hsl(45 85% 80%) 0%, transparent 55%), radial-gradient(60% 50% at 85% 80%, hsl(125 85% 82%) 0%, transparent 55%), linear-gradient(160deg, hsl(85 70% 90%) 0%, hsl(205 70% 86%) 100%)"
        accent="#EC4899"
        initials="NA"
        name="Noa Arden"
        tagline="Illustrator · prints & commissions"
        links={["Shop prints", "Commission me"]}
        icons={[Brush, Camera]}
        light
      />
    </div>
  );
}

function MiniProfile({
  className,
  bg,
  accent,
  initials,
  name,
  tagline,
  links,
  icons,
  glow,
  light,
  sharp,
}: {
  className?: string;
  bg: string;
  accent: string;
  initials: string;
  name: string;
  tagline: string;
  links: string[];
  icons: React.ComponentType<{ className?: string }>[];
  glow?: boolean;
  light?: boolean;
  sharp?: boolean;
}) {
  return (
    <div
      className={cn(
        "w-44 shrink-0 flex-col overflow-hidden rounded-[26px] border-[5px] border-surface-2 shadow-2xl ring-1 ring-border transition-transform duration-300 hover:scale-[1.03] sm:w-48",
        glow && "aura-glow",
        className,
      )}
    >
      <div className="flex flex-1 flex-col items-center px-3 py-6 text-center" style={{ background: bg }}>
        <span
          className="grid h-12 w-12 place-items-center rounded-full text-sm font-semibold"
          style={{ background: accent, color: light ? "#fff" : "#04120c" }}
        >
          {initials}
        </span>
        <p className={cn("font-display mt-3 text-sm font-medium", light ? "text-neutral-900" : "text-white")}>
          {name}
        </p>
        <p className={cn("mt-0.5 text-[10px]", light ? "text-neutral-600" : "text-white/60")}>{tagline}</p>
        <div className="mt-4 w-full space-y-2">
          {links.map((l, i) => (
            <div
              key={l}
              className={cn(
                "flex h-8 items-center justify-center text-[11px] font-medium",
                sharp ? "rounded-none" : "rounded-full",
              )}
              style={
                i === 0
                  ? { background: accent, color: light ? "#fff" : "#04120c" }
                  : {
                      border: `1px solid ${light ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)"}`,
                      color: light ? "#333" : "#fff",
                    }
              }
            >
              {l}
            </div>
          ))}
        </div>
        <div className={cn("mt-4 flex gap-3", light ? "text-neutral-600" : "text-white/70")}>
          {icons.map((Icon, i) => (
            <Icon key={i} className="h-4 w-4" />
          ))}
        </div>
      </div>
    </div>
  );
}
