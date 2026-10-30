"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Briefcase, CalendarCheck, Clapperboard, Link2, Loader2, Music, Plus, Shuffle, Store, X } from "lucide-react";
import { Phone } from "@/components/marketing/phone";
import { ImageField, TierPill } from "@/components/builder/ui";
import { buttonClasses } from "@/components/ui/button";
import { createFromWizard } from "@/lib/actions/pages";
import { BACKGROUNDS } from "@/lib/design";
import { BRAND } from "@/lib/brand";
import { PLAN_RANK, type Plan } from "@/lib/plans";
import { SocialIcon, platformFromUrl } from "@/lib/socials";
import { fitToPlanReport } from "@/lib/studio";
import { cn } from "@/lib/utils";
import { LOOKS, MAX_LINKS, PURPOSES, buildWizardPage, isIconLink, linkLabel, purposeOf, type PurposeId, type WizardState } from "@/lib/wizard";

const ICON: Record<PurposeId, React.ComponentType<{ className?: string }>> = {
  business: Store,
  services: CalendarCheck,
  creator: Clapperboard,
  portfolio: Briefcase,
  music: Music,
  personal: Link2,
};

const STEPS = ["מה בונים", "מי אתם", "איפה מוצאים אתכם", "מראה", "סיום"];

const field =
  "h-12 w-full rounded-lg border border-border bg-surface px-4 text-[1.02rem] text-text outline-none placeholder:text-text-muted/70 focus:border-text-muted";

export function Wizard({ plan, username, first, defaultName }: { plan: Plan; username: string; first: boolean; defaultName: string }) {
  const [step, setStep] = useState(0);
  const [s, setS] = useState<WizardState>({ purpose: "personal", name: defaultName, tagline: "", links: [], look: purposeOf("personal").look });
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const set = (p: Partial<WizardState>) => setS((x) => ({ ...x, ...p }));
  const purpose = purposeOf(s.purpose);

  const page = useMemo(() => buildWizardPage(s), [s]);
  // The preview shows exactly what goes live on the person's plan.
  const { content: live, locked } = useMemo(() => fitToPlanReport(page, plan), [page, plan]);

  const canNext = step !== 1 || s.name.trim().length > 0;
  const next = () => canNext && setStep((x) => Math.min(x + 1, STEPS.length - 1));
  const back = () => setStep((x) => Math.max(x - 1, 0));

  const addLink = () => {
    const url = draft.trim();
    if (!url || s.links.length >= MAX_LINKS) return;
    set({ links: [...s.links, { url, label: isIconLink(url) ? undefined : linkLabel(url) }] });
    setDraft("");
  };

  const finish = (publish: boolean) =>
    start(async () => {
      setError("");
      const res = await createFromWizard(s, publish);
      if (res && "error" in res) setError(res.error);
    });

  const bg = (id: string) => BACKGROUNDS.find((b) => b.id === LOOKS.find((l) => l.id === id)?.design.background)?.css;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
      <div className="min-w-0">
        <ol className="mb-8 flex gap-1.5" aria-label="שלבים">
          {STEPS.map((label, i) => (
            <li key={label} className="flex-1">
              <button
                type="button"
                disabled={i > step}
                onClick={() => setStep(i)}
                className="group block w-full text-start disabled:cursor-default"
                aria-current={i === step ? "step" : undefined}
              >
                <span className={cn("block h-1 rounded-full transition-colors duration-300", i <= step ? "bg-primary" : "bg-surface-2")} />
                <span className={cn("mt-2 hidden text-xs sm:block", i === step ? "text-text" : "text-text-muted")}>{label}</span>
              </button>
            </li>
          ))}
        </ol>

        <form
          key={step}
          onSubmit={(e) => {
            e.preventDefault();
            if (step === 2 && draft.trim()) return addLink();
            next();
          }}
          className="wz-step"
        >
          {step === 0 && (
            <>
              <h1 className="text-[1.9rem] leading-tight font-semibold">מה העמוד הזה?</h1>
              <p className="mt-2 text-text-muted">בוחרים כיוון, ואנחנו נשאל רק את מה שצריך. הכל ניתן לשינוי אחר כך.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {PURPOSES.map((p) => {
                  const Icon = ICON[p.id];
                  const on = s.purpose === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        set({ purpose: p.id, look: p.look });
                        setStep(1);
                      }}
                      className={cn(
                        "flex items-center gap-4 rounded-xl border p-4 text-start transition-colors",
                        on ? "border-primary bg-primary/10" : "border-border bg-surface hover:border-text-muted",
                      )}
                    >
                      <span className={cn("grid size-11 shrink-0 place-items-center rounded-lg", on ? "bg-primary text-primary-ink" : "bg-surface-2 text-text")}>
                        <Icon className="size-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold">{p.name}</span>
                        <span className="block text-sm text-text-muted">{p.blurb}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-6 text-sm text-text-muted">
                מעדיפים להתחיל מעמוד מלא?{" "}
                <Link href="/dashboard/new?gallery=1" className="text-text underline underline-offset-4">
                  לכל התבניות
                </Link>
              </p>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="text-[1.9rem] leading-tight font-semibold">{purpose.local ? "איך קוראים לעסק?" : "איך קוראים לכם?"}</h1>
              <p className="mt-2 text-text-muted">זו הכותרת הגדולה בראש העמוד.</p>
              <div className="mt-8 space-y-5">
                <input autoFocus value={s.name} onChange={(e) => set({ name: e.target.value })} maxLength={60} placeholder={purpose.local ? "קפה טקס הבוקר" : "נועה לוי"} aria-label="שם" className={field} />
                <div>
                  <label htmlFor="wz-tagline" className="mb-2 block text-sm text-text-muted">
                    שורה אחת עליכם
                  </label>
                  <input id="wz-tagline" value={s.tagline} onChange={(e) => set({ tagline: e.target.value })} maxLength={120} placeholder={purpose.example} className={field} />
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {purpose.taglines.map((t) => (
                      <button key={t} type="button" onClick={() => set({ tagline: t })} className="rounded-full border border-border px-3 py-1 text-sm text-text-muted hover:border-text-muted hover:text-text">
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm text-text-muted">{purpose.local ? "לוגו או תמונה (רשות)" : "תמונה (רשות)"}</p>
                  <ImageField value={s.avatar} onChange={(avatar) => set({ avatar })} maxDim={640} />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-[1.9rem] leading-tight font-semibold">איפה מוצאים אתכם?</h1>
              <p className="mt-2 text-text-muted">מדביקים קישור, ואנחנו מזהים לבד אם זה אינסטגרם, ביט, Waze או אתר.</p>
              <div className="mt-8 space-y-6">
                <div>
                  <label htmlFor="wz-wa" className="mb-2 block text-sm text-text-muted">
                    מספר וואטסאפ (רשות)
                  </label>
                  <input id="wz-wa" type="tel" dir="ltr" value={s.whatsapp ?? ""} onChange={(e) => set({ whatsapp: e.target.value || undefined })} placeholder="050-000-0000" className={cn(field, "text-end")} />
                </div>
                <div>
                  <label htmlFor="wz-link" className="mb-2 block text-sm text-text-muted">
                    קישורים ({s.links.length}/{MAX_LINKS})
                  </label>
                  <div className="flex gap-2">
                    <input id="wz-link" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="instagram.com/השם, קישור לביט, לאתר…" className={field} />
                    <button type="button" onClick={addLink} disabled={!draft.trim() || s.links.length >= MAX_LINKS} className={buttonClasses("secondary", "md", "h-12 shrink-0 rounded-lg")} aria-label="הוספת קישור">
                      <Plus className="size-4" /> הוספה
                    </button>
                  </div>
                  {s.links.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {s.links.map((l, i) => (
                        <li key={i} className="flex items-center gap-3 rounded-lg border border-border bg-surface p-2 ps-3">
                          <SocialIcon platform={platformFromUrl(l.url)} className="size-4 shrink-0 text-text-muted" />
                          {isIconLink(l.url) ? (
                            <span className="min-w-0 flex-1 truncate text-sm">
                              <span dir="ltr">{l.url.replace(/^https?:\/\/(www\.)?/, "")}</span>
                              <span className="ms-2 text-text-muted">· אייקון בשורת הרשתות</span>
                            </span>
                          ) : (
                            <input
                              value={l.label ?? ""}
                              onChange={(e) => set({ links: s.links.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })}
                              aria-label="טקסט הכפתור"
                              maxLength={60}
                              className="h-9 min-w-0 flex-1 rounded-md bg-surface-2 px-3 text-sm outline-none"
                            />
                          )}
                          <button type="button" onClick={() => set({ links: s.links.filter((_, j) => j !== i) })} aria-label="הסרה" className="grid size-8 shrink-0 place-items-center rounded-md text-text-muted hover:text-text">
                            <X className="size-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {purpose.local && (
                  <div className="space-y-3 rounded-xl border border-border p-4">
                    <label htmlFor="wz-addr" className="block text-sm text-text-muted">
                      כתובת העסק (רשות)
                    </label>
                    <input id="wz-addr" value={s.address ?? ""} onChange={(e) => set({ address: e.target.value || undefined })} maxLength={120} placeholder="שדרות רוטשילד 1, תל אביב" className={field} />
                    <label className="flex cursor-pointer items-center justify-between gap-3 pt-1 text-sm">
                      <span>
                        שעות פתיחה עם &quot;פתוח עכשיו&quot;
                        <span className="block text-text-muted">מתחילים מא׳–ה׳ 9–18, ו׳ 9–13. משנים בעורך.</span>
                      </span>
                      <input type="checkbox" checked={!!s.hours} onChange={(e) => set({ hours: e.target.checked })} className="size-5 accent-[var(--primary)]" />
                    </label>
                  </div>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h1 className="text-[1.9rem] leading-tight font-semibold">איזה מראה?</h1>
                  <p className="mt-2 text-text-muted">{LOOKS.length} ערכות. כל צבע, פונט וכפתור ניתנים לשינוי בעורך.</p>
                </div>
                <button
                  type="button"
                  onClick={() => set({ look: LOOKS.filter((l) => l.id !== s.look)[Math.floor(Math.random() * (LOOKS.length - 1))].id })}
                  className={buttonClasses("secondary", "sm", "rounded-lg")}
                >
                  <Shuffle className="size-4" /> הפתיעו אותי
                </button>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                {LOOKS.map((t) => {
                  const on = s.look === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => set({ look: t.id })}
                      aria-pressed={on}
                      className={cn("overflow-hidden rounded-lg border-2 text-start transition-transform", on ? "border-primary" : "border-transparent hover:-translate-y-0.5")}
                    >
                      <span className="relative block h-16" style={{ background: bg(t.id) ?? "#111" }}>
                        <span className="absolute inset-x-3 bottom-3 h-2.5 rounded-full" style={{ background: t.accent }} />
                      </span>
                      <span className="flex items-center justify-between gap-1 bg-surface px-2 py-1.5 text-xs">
                        <span className="truncate">{t.name}</span>
                        {PLAN_RANK[t.tier] > PLAN_RANK[plan] && <TierPill tier={t.tier} />}
                      </span>
                    </button>
                  );
                })}
              </div>
              {locked.length > 0 && (
                <p className="mt-4 rounded-lg bg-surface-2 p-3 text-sm text-text-muted">
                  בחבילה שלכם הערכה מוצגת בלי {locked.map((l) => l.label.split(":")[0]).filter((v, i, a) => a.indexOf(v) === i).slice(0, 3).join(", ")}. מה שבתצוגה הוא בדיוק מה שיעלה לאוויר.
                </p>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <h1 className="text-[1.9rem] leading-tight font-semibold">העמוד מוכן</h1>
              <p className="mt-2 text-text-muted">
                {first ? (
                  <>
                    הכתובת שלכם: <span dir="ltr" className="text-text">{BRAND.domain}/{username}</span>
                  </>
                ) : (
                  "העמוד יתווסף לחשבון שלכם."
                )}
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                {[
                  `${purpose.name}: ${s.name.trim() || "בלי שם"}`,
                  s.links.length || s.whatsapp ? `${s.links.length + (s.whatsapp ? 1 : 0)} קישורים` : "בלי קישורים, אפשר להוסיף בעורך",
                  `מראה: ${LOOKS.find((l) => l.id === s.look)?.name}`,
                ].map((x) => (
                  <li key={x} className="flex gap-2.5">
                    <span className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-primary" />
                    {x}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-2 sm:flex-row">
                <button type="button" disabled={pending} onClick={() => finish(true)} className={buttonClasses("primary", "lg", "rounded-lg")}>
                  {pending ? <Loader2 className="size-5 animate-spin" /> : null} פרסום העמוד
                </button>
                <button type="button" disabled={pending} onClick={() => finish(false)} className={buttonClasses("secondary", "lg", "rounded-lg")}>
                  שמירה והמשך עריכה
                </button>
              </div>
              {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
              <p className="mt-4 text-sm text-text-muted">בעורך מחכים עוד {purpose.next.length} בלוקים שמתאימים ל{purpose.name}, ו־22 בסך הכל.</p>
            </>
          )}

          {step > 0 && step < 4 && (
            <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-5">
              <button type="button" onClick={back} className={buttonClasses("ghost", "md", "-ms-3")}>
                <ArrowLeft className="size-4" /> חזרה
              </button>
              <button type="submit" disabled={!canNext} className={buttonClasses("primary", "md", "rounded-lg")}>
                {step === 2 && !s.links.length && !s.whatsapp ? "דילוג" : "המשך"} <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </form>
      </div>

      <aside className="mx-auto lg:sticky lg:top-8 lg:self-start" aria-label="תצוגה מקדימה">
        <Phone content={live} width={300} height={612} />
        <p className="mt-3 text-center text-xs text-text-muted">מתעדכן תוך כדי הקלדה</p>
      </aside>
    </div>
  );
}
