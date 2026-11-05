"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Primitive re-exports                                               */
/* ------------------------------------------------------------------ */

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

/* ------------------------------------------------------------------ */
/*  Trigger                                                            */
/* ------------------------------------------------------------------ */

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    invalid?: boolean;
    size?: "sm" | "md" | "lg";
  }
>(({ className, children, invalid, size = "md", ...props }, ref) => {
  const sizeMap: Record<string, string> = {
    sm: "h-8 text-body-sm",
    md: "h-10 text-body-md",
    lg: "h-11 text-body-md",
  };
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-2xl border bg-surface-container-lowest cursor-pointer",
        "border-outline-variant px-3 text-on-surface",
        "transition-colors data-[placeholder]:text-on-surface-variant/70",
        "focus:outline-none focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container/15",
        "data-[state=open]:border-on-tertiary-container",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "[&>span]:line-clamp-1 [&_svg]:shrink-0",
        invalid &&
        "border-error focus:border-error focus:ring-error/15",
        sizeMap[size],
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 opacity-70" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

/* ------------------------------------------------------------------ */
/*  Scroll buttons                                                     */
/* ------------------------------------------------------------------ */

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1 text-on-surface-variant",
      className,
    )}
    {...props}
  >
    <ChevronUp className="size-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1 text-on-surface-variant",
      className,
    )}
    {...props}
  >
    <ChevronDown className="size-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      sideOffset={4}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden",
        "w-[var(--radix-select-trigger-width)]",
        "rounded-2xl border border-outline-variant",
        "bg-surface-container-lowest text-on-surface shadow-elevated",
        position === "popper" &&
        "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
        className,
      )}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "bg-surface-container-lowest p-1",
          position === "popper" && "w-full",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

/* ------------------------------------------------------------------ */
/*  Label / Item / Separator                                           */
/* ------------------------------------------------------------------ */

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-label-md uppercase text-on-surface-variant",
      className,
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    /** Shown in the open list only. The closed field keeps `children`. */
    description?: string;
  }
>(({ className, children, description, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none gap-2",
      description ? "items-start py-2" : "items-center py-1.5",
      "rounded-sm pl-8 pr-2 text-body-md text-on-surface outline-none",
      "bg-surface-container-lowest",
      "hover:bg-surface-container-low focus:bg-surface-container-low",
      "data-[highlighted]:bg-surface-container-low data-[highlighted]:text-on-surface",
      "data-[state=checked]:font-medium",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span
      className={cn(
        "absolute left-2 flex size-4 items-center justify-center",
        description && "top-2.5",
      )}
    >
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4 text-on-tertiary-container" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <span className="flex min-w-0 flex-col gap-0.5">
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      {description ? (
        <span className="whitespace-normal text-body-sm font-normal leading-snug text-on-surface-variant">
          {description}
        </span>
      ) : null}
    </span>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-outline-variant", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
