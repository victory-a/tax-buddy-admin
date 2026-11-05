"use client";

import * as React from "react";

import { Label } from "@/components/ui/text-input";
import { cn } from "@/lib/utils";

export type AutocompleteProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly string[];
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
  containerClassName?: string;
  inputClassName?: string;
  "aria-required"?: boolean;
};

function filterOptions(options: readonly string[], query: string): string[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [...options];
  }

  return options.filter((option) => option.toLowerCase().includes(normalized));
}

export function Autocomplete({
  id,
  value,
  onValueChange,
  options,
  disabled = false,
  placeholder,
  label,
  helperText,
  errorText,
  required,
  containerClassName,
  inputClassName,
  "aria-required": ariaRequired,
}: AutocompleteProps) {
  const reactId = React.useId();
  const inputId = id ?? reactId;
  const listId = `${inputId}-listbox`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const optionRefs = React.useRef<Array<HTMLLIElement | null>>([]);

  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const suggestions = React.useMemo(
    () => filterOptions(options, value),
    [options, value],
  );
  const showList = open && suggestions.length > 0;
  const hasError = Boolean(errorText);

  const closeList = React.useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const selectSuggestion = React.useCallback(
    (option: string) => {
      onValueChange(option);
      closeList();
    },
    [closeList, onValueChange],
  );

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeList();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [closeList, open]);

  React.useEffect(() => {
    if (activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(0);
        return;
      }

      setActiveIndex((current) =>
        current < suggestions.length - 1 ? current + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(suggestions.length - 1);
        return;
      }

      setActiveIndex((current) =>
        current > 0 ? current - 1 : suggestions.length - 1,
      );
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
      return;
    }

    if (event.key === "Escape") {
      closeList();
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", containerClassName)}>
      {label ? (
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
      ) : null}

      <div ref={containerRef} className="relative w-full">
        <input
          id={inputId}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-required={ariaRequired ?? required}
          aria-invalid={hasError || undefined}
          aria-describedby={
            hasError ? errorId : helperText ? helperId : undefined
          }
          aria-activedescendant={
            showList && activeIndex >= 0
              ? `${listId}-option-${activeIndex}`
              : undefined
          }
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            onValueChange(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex h-10 w-full rounded border bg-surface-container-lowest px-3 text-body-md text-on-surface outline-none",
            "border-outline-variant placeholder:text-on-surface-variant/60",
            "transition-colors duration-150",
            "focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/15",
            "disabled:cursor-not-allowed disabled:bg-surface-container-low disabled:opacity-60",
            hasError &&
              "border-error focus:border-error focus:ring-error/15",
            inputClassName,
          )}
        />

        {showList ? (
          <ul
            id={listId}
            role="listbox"
            className={cn(
              "absolute z-60 mt-1 max-h-80 w-full overflow-y-auto rounded-md border border-outline-variant",
              "bg-surface-container-lowest p-1 text-on-surface shadow-elevated",
            )}
          >
            {suggestions.map((option, index) => (
              <li
                key={option}
                id={`${listId}-option-${index}`}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                role="option"
                aria-selected={activeIndex === index}
                className={cn(
                  "cursor-pointer rounded-sm px-3 py-1.5 text-body-md outline-none",
                  activeIndex === index
                    ? "bg-surface-container-low text-on-surface"
                    : "text-on-surface hover:bg-surface-container-low",
                )}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectSuggestion(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {hasError ? (
        <p id={errorId} className="text-body-sm text-error">
          {errorText}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-body-sm text-on-surface-variant">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
