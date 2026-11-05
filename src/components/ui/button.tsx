"use client";

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-sans font-medium select-none cursor-pointer",
    "rounded-2xl transition-colors duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-on-primary hover:bg-primary-container active:bg-primary-container",
        secondary:
          "bg-surface-container text-on-surface hover:bg-surface-container-high active:bg-surface-container-highest",
        inverted:
          "bg-inverse-surface text-inverse-on-surface hover:bg-primary-container",
        outlined:
          "bg-transparent text-on-surface border border-outline-variant hover:bg-surface-container-low active:bg-surface-container",
        ghost:
          "bg-transparent text-on-surface hover:bg-surface-container-low active:bg-surface-container",
        success:
          "bg-secondary text-on-secondary hover:bg-on-secondary-fixed-variant active:bg-on-secondary-fixed-variant",
        destructive:
          "bg-error text-on-error hover:bg-on-error-container",
        link: "bg-transparent text-on-tertiary-container underline-offset-4 hover:underline px-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-body-sm",
        md: "h-10 px-4 text-body-md",
        lg: "h-11 px-5 text-body-md",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as the child component (e.g. an `<a>` tag) using Radix Slot. */
  asChild?: boolean;
  /** Optional leading icon node. */
  iconLeft?: React.ReactNode;
  /** Optional trailing icon node. */
  iconRight?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      iconLeft,
      iconRight,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {iconLeft}
        <Slottable>{children}</Slottable>
        {iconRight}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
