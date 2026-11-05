"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Label                                                              */
/* ------------------------------------------------------------------ */

export type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
  required?: boolean;
};

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        "text-body-md font-medium text-on-surface",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    >
      {children}
      {required ? (
        <span className="ml-0.5 text-error" aria-hidden>
          *
        </span>
      ) : null}
    </LabelPrimitive.Root>
  ),
);
Label.displayName = "Label";

/* ------------------------------------------------------------------ */
/*  TextInput                                                          */
/* ------------------------------------------------------------------ */

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Optional label rendered above the input. */
  label?: string;
  /** Helper text displayed below the input. */
  helperText?: string;
  /** Error message — switches the input into an error state. */
  errorText?: string;
  /** Optional leading content (icon or text). */
  leading?: React.ReactNode;
  /** Optional trailing content (icon or text). */
  trailing?: React.ReactNode;
  /** Container className (the wrapper around label + input + helper). */
  containerClassName?: string;
  /** ClassName for the bordered field, including background. */
  fieldClassName?: string;
  /** Input size variants. */
  inputSize?: "sm" | "md" | "lg";
}

const sizeClasses: Record<NonNullable<TextInputProps["inputSize"]>, string> = {
  sm: "h-8 text-body-sm",
  md: "h-10 text-body-md",
  lg: "h-11 text-body-md",
};

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      id,
      label,
      helperText,
      errorText,
      leading,
      trailing,
      className,
      containerClassName,
      fieldClassName,
      inputSize = "md",
      disabled,
      required,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    const hasError = Boolean(errorText);
    const fieldHasBackground = fieldClassName?.split(/\s+/).some((token) => token.startsWith("bg-"));

    return (
      <div
        className={cn("flex flex-col gap-1.5 w-full", containerClassName)}
      >
        {label ? (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        ) : null}
        <div
          className={cn(
            "group flex items-center w-full rounded-2xl border",
            !fieldHasBackground && "bg-surface-container-lowest",
            "border-outline-variant",
            "transition-colors duration-150",
            "focus-within:border-on-tertiary-container focus-within:ring-2 focus-within:ring-on-tertiary-container/15",
            hasError &&
            "border-error focus-within:border-error focus-within:ring-error/15",
            disabled && "bg-surface-container-low opacity-60",
            fieldClassName,
          )}
        >
          {leading ? (
            <span className="flex items-center pl-3 text-on-surface-variant [&_svg]:size-4">
              {leading}
            </span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError || undefined}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "peer flex-1 min-w-0 bg-transparent outline-none",
              "px-3 py-0",
              "text-on-surface placeholder:text-on-surface-variant/60",
              "disabled:cursor-not-allowed",
              sizeClasses[inputSize],
              leading && "pl-2",
              trailing && "pr-2",
              className,
            )}
            {...props}
          />
          {trailing ? (
            <span className="flex items-center pr-3 text-on-surface-variant [&_svg]:size-4">
              {trailing}
            </span>
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
  },
);
TextInput.displayName = "TextInput";

export { TextInput, Label };
