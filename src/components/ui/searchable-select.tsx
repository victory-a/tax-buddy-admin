"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";

import { Label } from "@/components/ui/text-input";
import { cn } from "@/lib/utils";

export type SearchableSelectOption = {
  value: string;
  label?: string;
  description?: string;
};

export type SearchableSelectProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly SearchableSelectOption[];
  disabled?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: React.ReactNode;
  helperText?: string;
  emptyText?: string;
  containerClassName?: string;
};

type MenuPosition = {
  top: number;
  left: number;
  width: number;
};

function filterOptions(
  options: readonly SearchableSelectOption[],
  query: string,
): SearchableSelectOption[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [...options];
  return options.filter((option) => {
    const haystack = `${option.value} ${option.label ?? ""} ${option.description ?? ""}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

export function SearchableSelect({
  id,
  value,
  onValueChange,
  options,
  disabled = false,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  label,
  helperText,
  emptyText = "No matches",
  containerClassName,
}: SearchableSelectProps) {
  const reactId = React.useId();
  const inputId = id ?? reactId;
  const listId = `${inputId}-listbox`;
  const helperId = `${inputId}-helper`;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const optionRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [position, setPosition] = React.useState<MenuPosition | null>(null);
  const [mounted, setMounted] = React.useState(false);

  const selected = options.find((option) => option.value === value) ?? null;
  const suggestions = React.useMemo(() => filterOptions(options, query), [options, query]);

  const close = React.useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
    setPosition(null);
  }, []);

  const selectOption = React.useCallback(
    (next: string) => {
      onValueChange(next);
      close();
    },
    [close, onValueChange],
  );

  const updatePosition = React.useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const menuHeight = Math.min(320, window.innerHeight - 24);
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const openUp = spaceBelow < 220 && rect.top > spaceBelow;
    const top = openUp
      ? Math.max(8, rect.top - Math.min(menuHeight, rect.top - 8) - 4)
      : rect.bottom + 4;
    setPosition({
      top,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    updatePosition();
    const onReposition = () => updatePosition();
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open, updatePosition]);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      close();
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [close, open]);

  React.useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => searchRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  React.useEffect(() => {
    if (!open || activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function onTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(0);
    }
  }

  function onSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        suggestions.length === 0 ? -1 : current < suggestions.length - 1 ? current + 1 : 0,
      );
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        suggestions.length === 0 ? -1 : current > 0 ? current - 1 : suggestions.length - 1,
      );
      return;
    }
    if (event.key === "Enter" && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      selectOption(suggestions[activeIndex].value);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  }

  const menu =
    open && mounted && position
      ? createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              width: position.width,
            }}
            className={cn(
              "z-[80] overflow-hidden rounded-2xl border border-outline-variant",
              "bg-surface-container-lowest shadow-elevated",
            )}
          >
            <div className="flex items-center gap-2 border-b border-outline-variant px-3 py-2">
              <Search className="size-4 shrink-0 text-on-surface-variant" aria-hidden />
              <input
                ref={searchRef}
                type="search"
                value={query}
                placeholder={searchPlaceholder}
                className="h-8 w-full bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant/70"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onSearchKeyDown}
              />
            </div>
            <ul
              id={listId}
              role="listbox"
              aria-label={typeof label === "string" ? label : "Options"}
              className="max-h-64 overflow-y-auto p-1"
            >
              {suggestions.length === 0 ? (
                <li className="px-3 py-2 text-body-sm text-on-surface-variant">{emptyText}</li>
              ) : (
                suggestions.map((option, index) => {
                  const active = index === activeIndex;
                  const checked = option.value === value;
                  return (
                    <li key={option.value} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={checked}
                        ref={(node) => {
                          optionRefs.current[index] = node;
                        }}
                        className={cn(
                          "flex w-full cursor-pointer items-start gap-2 rounded-sm px-2 py-2 text-left text-body-md",
                          "hover:bg-surface-container-low focus:bg-surface-container-low focus:outline-none",
                          active && "bg-surface-container-low",
                          checked && "font-medium",
                        )}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => selectOption(option.value)}
                      >
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center">
                          {checked ? <Check className="size-4 text-on-tertiary-container" /> : null}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">{option.label ?? option.value}</span>
                          {option.description ? (
                            <span className="mt-0.5 block truncate text-body-sm font-normal text-on-surface-variant">
                              {option.description}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={containerRef} className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
      {label ? (
        <Label htmlFor={inputId} className="cursor-pointer">
          {label}
        </Label>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        id={inputId}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-describedby={helperText ? helperId : undefined}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-2xl border bg-surface-container-lowest px-3",
          "border-outline-variant text-left text-body-md text-on-surface",
          "transition-colors focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/15",
          open && "border-on-tertiary-container",
          disabled && "cursor-not-allowed opacity-60",
          !disabled && "cursor-pointer",
        )}
        onClick={() => {
          if (disabled) return;
          setOpen((current) => !current);
        }}
        onKeyDown={onTriggerKeyDown}
      >
        <span className={cn("min-w-0 truncate", !selected && "text-on-surface-variant/70")}>
          {selected ? (selected.label ?? selected.value) : placeholder}
        </span>
        <ChevronDown className={cn("size-4 shrink-0 opacity-70 transition-transform", open && "rotate-180")} />
      </button>

      {menu}

      {helperText ? (
        <p id={helperId} className="text-body-sm text-on-surface-variant">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
