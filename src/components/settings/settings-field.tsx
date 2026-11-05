"use client";

import * as React from "react";

import { Checkbox, TextInput } from "@/components/ui";

export function SettingsSection({
  title,
  description,
  children,
  className,
  contentClassName,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section className={className ?? "max-w-2xl space-y-6"}>
      <div className="space-y-1">
        <h2 className="font-display text-headline-sm text-on-surface">{title}</h2>
        <p className="text-body-sm text-on-surface-variant">{description}</p>
      </div>
      <div className={contentClassName ?? "space-y-5"}>{children}</div>
    </section>
  );
}

export function DirtyFieldLabel({ label, dirty }: { label: string; dirty: boolean }) {
  if (!dirty) return label;
  return (
    <span className="inline-flex items-center gap-2">
      <span>{label}</span>
      <span className="inline-flex items-center gap-1 text-body-sm font-normal text-error">
        <span className="size-1.5 rounded-full bg-error" aria-hidden />
        Changed
      </span>
    </span>
  );
}

export function SettingsTextField({
  label,
  helperText,
  value,
  onChange,
  onCommit,
  dirty = false,
  type = "text",
  min,
  max,
  step,
  disabled,
}: {
  label: string;
  helperText?: string;
  value: string | number;
  /** Controlled edits (form + Save). Prefer this over `onCommit`. */
  onChange?: (next: string) => void;
  /** Blur-to-save. Ignored when `onChange` is set. */
  onCommit?: (next: string) => void;
  /** Marks the field as edited vs the last saved value. */
  dirty?: boolean;
  type?: "text" | "number" | "url";
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}) {
  const [draft, setDraft] = React.useState(String(value));
  const controlled = onChange != null;

  React.useEffect(() => {
    if (!controlled) setDraft(String(value));
  }, [value, controlled]);

  const current = controlled ? String(value) : draft;

  return (
    <TextInput
      label={<DirtyFieldLabel label={label} dirty={dirty} />}
      helperText={helperText}
      type={type}
      inputMode={type === "number" ? "numeric" : undefined}
      min={min}
      max={max}
      step={step}
      value={current}
      disabled={disabled}
      onChange={(event) => {
        if (controlled) onChange(event.target.value);
        else setDraft(event.target.value);
      }}
      onBlur={() => {
        if (controlled || !onCommit) return;
        if (draft === String(value)) return;
        onCommit(draft);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
      }}
    />
  );
}

export function SettingsToggleField({
  label,
  description,
  checked,
  onChange,
  dirty = false,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  dirty?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <Checkbox
        className="mt-0.5"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="min-w-0">
        <span className="block text-body-md font-medium text-on-surface">
          <DirtyFieldLabel label={label} dirty={dirty} />
        </span>
        <span className="mt-0.5 block text-body-sm text-on-surface-variant">{description}</span>
      </span>
    </label>
  );
}
