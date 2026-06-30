"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  BarChart3,
  Image as ImageIcon,
  Settings,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  longLabel?: string;
  icon: typeof LayoutGrid;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Pages", longLabel: "My pages", icon: LayoutGrid, exact: true },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/media", label: "Media", icon: ImageIcon },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const ADMIN_ITEM: NavItem = { href: "/admin", label: "Admin", icon: Shield };

export function DashboardNav({
  orientation = "vertical",
  isAdmin = false,
}: {
  orientation?: "vertical" | "horizontal";
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const horizontal = orientation === "horizontal";
  const items = isAdmin ? [...NAV, ADMIN_ITEM] : NAV;
  return (
    <nav className={cn(horizontal ? "flex w-full gap-1" : "mt-8 space-y-1")}>
      {items.map(({ href, label, longLabel, icon: Icon, exact }) => {
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
