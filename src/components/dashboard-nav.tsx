"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Paintbrush,
  CalendarDays,
  Scissors,
  Clock,
  Settings,
  Gem,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HilaLogo } from "@/components/ui";
import { logoutAction } from "@/lib/actions/auth";

const ITEMS = [
  { href: "/dashboard", label: "סקירה", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/editor", label: "עיצוב העמוד", icon: Paintbrush },
  { href: "/dashboard/appointments", label: "יומן תורים", icon: CalendarDays },
  { href: "/dashboard/services", label: "שירותים", icon: Scissors },
  { href: "/dashboard/hours", label: "שעות פעילות", icon: Clock },
  { href: "/dashboard/plan", label: "החבילה שלי", icon: Gem },
  { href: "/dashboard/settings", label: "הגדרות", icon: Settings },
];

export function DashboardNav({ slug, businessName }: { slug: string; businessName: string }) {
  const pathname = usePathname();
  return (
    <>
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-60 flex-col border-l border-line bg-night-2 p-4 lg:flex">
        <Link href="/dashboard" className="mb-1 px-2 py-1.5">
          <HilaLogo />
        </Link>
        <p className="mb-5 truncate px-2 text-xs text-ink-2">{businessName}</p>
        <nav className="flex flex-1 flex-col gap-1">
          {ITEMS.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active ? "bg-halo/12 text-halo" : "text-ink-2 hover:bg-white/5 hover:text-ink",
                )}
              >
                <item.icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <a
          href={`/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-2 transition hover:bg-white/5 hover:text-ink"
        >
          <ExternalLink className="h-4.5 w-4.5" strokeWidth={1.75} />
          לעמוד שלי
        </a>
        <form action={logoutAction}>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-2 transition hover:bg-white/5 hover:text-ink cursor-pointer">
            <LogOut className="h-4.5 w-4.5" strokeWidth={1.75} />
            התנתקות
          </button>
        </form>
      </aside>

      {/* mobile top bar + bottom tabs */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-night-2/90 px-4 backdrop-blur lg:hidden">
        <Link href="/dashboard">
          <HilaLogo size={22} />
        </Link>
        <div className="flex items-center gap-1">
          <a href={`/${slug}`} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-ink-2 hover:text-ink">
            <ExternalLink className="h-5 w-5" />
          </a>
          <form action={logoutAction}>
            <button className="rounded-lg p-2 text-ink-2 hover:text-ink cursor-pointer">
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </div>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-line bg-night-2/95 px-1 py-1.5 backdrop-blur lg:hidden">
        {ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-medium",
                active ? "text-halo" : "text-ink-2",
              )}
            >
              <item.icon className="h-5 w-5" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
