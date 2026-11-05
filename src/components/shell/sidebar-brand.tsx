"use client";

import Link from "next/link";
import { PanelLeftClose, PanelRightClose } from "lucide-react";

import { APP_HOME_PATH } from "@/lib/app-home";
import { cn } from "@/lib/utils";

export function SidebarBrand({
  collapsed,
  onCollapsedChange,
}: {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 border-b border-outline-variant/40",
        collapsed
          ? "flex-col items-center gap-2 px-2 py-3"
          : "h-[60px] flex-row items-center gap-2 px-3",
      )}
    >
      {!collapsed ? (
        <>
          <Link
            href={APP_HOME_PATH}
            className="flex min-w-0 flex-1 items-center gap-2.5 text-on-surface"
            aria-label="tax-buddy admin home"
          >
            <span
              aria-hidden
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary text-body-sm font-semibold shadow-sm"
            >
              tb
            </span>
            <span className="min-w-0 truncate">
              <span className="block font-display text-headline-sm tracking-tight leading-tight">
                tax-buddy
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
                admin
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => onCollapsedChange(true)}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            className={cn(
              "inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg",
              "text-on-surface-variant transition-colors",
              "hover:bg-surface-container hover:text-on-surface",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container/35",
            )}
          >
            <PanelLeftClose className="size-[18px]" aria-hidden strokeWidth={1.5} />
          </button>
        </>
      ) : (
        <>
          <Link
            href={APP_HOME_PATH}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary text-body-sm font-semibold shadow-sm"
            aria-label="tax-buddy admin home"
          >
            tb
          </Link>
          <button
            type="button"
            onClick={() => onCollapsedChange(false)}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className={cn(
              "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg",
              "text-on-surface-variant transition-colors",
              "hover:bg-surface-container hover:text-on-surface",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container/35",
            )}
          >
            <PanelRightClose className="size-[18px]" aria-hidden strokeWidth={1.5} />
          </button>
        </>
      )}
    </div>
  );
}
