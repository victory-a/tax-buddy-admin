"use client";

import * as React from "react";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  indeterminate?: boolean;
};

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate = false, checked, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <label className={cn("relative inline-flex cursor-pointer", className)}>
        <input
          type="checkbox"
          ref={inputRef}
          checked={checked}
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded border border-outline-variant",
            "bg-surface-container-lowest transition-colors",
            "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-secondary-fixed-dim/60",
            "peer-checked:border-secondary-fixed-dim peer-checked:bg-secondary-fixed-dim",
            "peer-checked:[&_svg]:opacity-100",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            indeterminate && "border-secondary-fixed-dim bg-secondary-fixed-dim/70",
          )}
        >
          {indeterminate ? (
            <Minus className="size-3 stroke-[2.5] text-on-secondary-fixed" aria-hidden />
          ) : (
            <Check
              className="size-3 stroke-[2.5] text-on-secondary-fixed opacity-0"
              aria-hidden
            />
          )}
        </span>
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
