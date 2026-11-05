"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export type ChipProps = {
  children: React.ReactNode;
  /** Shows a dismiss control when provided. */
  onRemove?: () => void;
  /** Accessible label for the dismiss control (defaults to “Remove”). */
  removeLabel?: string;
  disabled?: boolean;
  /**
   * `default` — income / affirmative keywords (primary tint).
   * `muted` — ignore keywords (neutral outline, quieter fill).
   */
  variant?: "default" | "muted";
  className?: string;
};

const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      children,
      onRemove,
      removeLabel = "Remove",
      disabled = false,
      variant = "default",
      className,
    },
    ref,
  ) => {
    const isMuted = variant === "muted";

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-0.5 rounded-lg border border-dotted px-2.5 py-1 text-body-sm",
          !isMuted && "border-primary bg-primary/10 text-primary",
          isMuted &&
            "border-outline bg-surface-container text-error",
          className,
        )}
      >
        {children}
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className={cn(
              "ml-0.5 cursor-pointer rounded-sm p-0.5 transition-colors disabled:opacity-50",
              !isMuted &&
                "text-on-surface-variant hover:bg-primary/10 hover:text-primary",
              isMuted &&
                "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
            )}
            aria-label={removeLabel}
          >
            <X className="size-3.5" aria-hidden />
          </button>
        ) : null}
      </span>
    );
  },
);
Chip.displayName = "Chip";

export { Chip };
