"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type UnderlineTabItem<T extends string> = {
  id: T;
  label: string;
};

export function UnderlineTabs<T extends string>({
  items,
  active,
  onChange,
  ariaLabel,
  idPrefix,
}: {
  items: readonly UnderlineTabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  ariaLabel: string;
  idPrefix: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex gap-1 overflow-x-auto border-b border-outline-variant/60"
    >
      {items.map((tab) => {
        const selected = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              "-mb-px cursor-pointer border-b-2 px-4 py-2.5 text-body-md font-medium transition-colors whitespace-nowrap",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container/35 focus-visible:ring-offset-2",
              selected
                ? "border-primary text-on-surface"
                : "border-transparent text-on-surface-variant hover:text-on-surface",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function UnderlineTabPanel({
  idPrefix,
  tab,
  active,
  children,
}: {
  idPrefix: string;
  tab: string;
  active: string;
  children: ReactNode;
}) {
  if (tab !== active) return null;

  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${tab}`}
      aria-labelledby={`${idPrefix}-tab-${tab}`}
    >
      {children}
    </div>
  );
}
