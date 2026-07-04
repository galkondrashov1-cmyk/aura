"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/pages", label: "Pages", icon: FileText },
];

export function AdminNav({
  orientation = "vertical",
}: {
  orientation?: "vertical" | "horizontal";
}) {
  const pathname = usePathname();
  const horizontal = orientation === "horizontal";
  return (
    <nav className={cn(horizontal ? "flex w-full gap-1" : "mt-6 space-y-1")}>
      {NAV.map(({ href, label, icon: Icon, exact }) => {
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
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
