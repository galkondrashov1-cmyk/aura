"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  BarChart3,
  Image as ImageIcon,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Pages", longLabel: "My pages", icon: LayoutGrid, exact: true },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/media", label: "Media", icon: ImageIcon },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardNav({
  orientation = "vertical",
}: {
  orientation?: "vertical" | "horizontal";
}) {
  const pathname = usePathname();
  const horizontal = orientation === "horizontal";
  return (
    <nav className={cn(horizontal ? "flex w-full gap-1" : "mt-8 space-y-1")}>
      {NAV.map(({ href, label, longLabel, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center rounded-xl text-sm transition-colors",
              horizontal
                ? "flex-1 flex-col justify-center gap-1 px-1 py-1.5 text-xs"
                : "gap-3 px-3 py-2",
              active
                ? "bg-surface text-text"
                : "text-text-muted hover:bg-surface hover:text-text",
            )}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            <span className="truncate">{horizontal ? label : (longLabel ?? label)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
