"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { type NavItem, isActivePath } from "./sidebar-nav";

export function SidebarNavSection({
  title,
  items,
  pathname,
  collapsed,
  className,
}: {
  title: string;
  items: readonly NavItem[];
  pathname: string;
  collapsed: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {!collapsed ? (
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant/70">
          {title}
        </p>
      ) : null}
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActivePath(pathname, item.href, item.end);

        return (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={cn(
              "relative flex items-center gap-3 rounded-xl text-body-md transition-colors",
              collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
              active
                ? "bg-surface-container-high font-semibold text-on-surface shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
            )}
          >
            <Icon className="size-[22px] shrink-0 stroke-[1.5]" aria-hidden />
            {!collapsed ? <span className="min-w-0 flex-1 truncate">{item.label}</span> : null}
            {!collapsed && active ? (
              <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
