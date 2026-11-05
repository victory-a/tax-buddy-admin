"use client";

import * as React from "react";

import { EditKeywordDialog } from "@/components/rules/edit-keyword-dialog";
import { Button, Chip, TextInput } from "@/components/ui";
import {
  type AdminPersonaKeyword,
  useCreateAdminPersonaKeyword,
} from "@/lib/api/admin-persona-keywords";
import type { AdminPersona } from "@/lib/persona-labels";
import { showToast } from "@/lib/toast";

function KeywordChip({
  item,
  onEdit,
}: {
  item: AdminPersonaKeyword;
  onEdit: (item: AdminPersonaKeyword) => void;
}) {
  return (
    <Chip
      variant={item.kind === "exclude" ? "muted" : "default"}
      className="cursor-pointer"
    >
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-1 bg-transparent p-0 text-inherit"
        onClick={() => onEdit(item)}
        aria-label={`Edit ${item.keywordLabel}`}
      >
        <span className="font-medium">{item.keywordLabel}</span>
        {item.weight !== 1 ? (
          <span className="opacity-70 tabular-nums">×{item.weight}</span>
        ) : null}
      </button>
    </Chip>
  );
}

function AddKeywordRow({
  persona,
  kind,
}: {
  persona: AdminPersona;
  kind: "include" | "exclude";
}) {
  const create = useCreateAdminPersonaKeyword(persona);
  const [label, setLabel] = React.useState("");

  return (
    <form
      className="flex flex-wrap items-end gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const keywordLabel = label.trim();
        if (!keywordLabel) return;
        void create.mutateAsync({ keywordLabel, kind, weight: 1 }).then(() => {
          showToast({ value: "Keyword added", variant: "success" });
          setLabel("");
        });
      }}
    >
      <TextInput
        name={`${kind}-keyword`}
        label={`Add ${kind}`}
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="e.g. uber"
        containerClassName="min-w-[12rem] flex-1"
        inputSize="sm"
      />
      <Button type="submit" size="sm" disabled={create.isPending || !label.trim()}>
        Add
      </Button>
    </form>
  );
}

export function KeywordBank({
  persona,
  kind,
  title,
  description,
  items,
  taxProfileCount,
}: {
  persona: AdminPersona;
  kind: "include" | "exclude";
  title: string;
  description: string;
  items: AdminPersonaKeyword[];
  taxProfileCount: number;
}) {
  const filtered = items.filter((item) => item.kind === kind);
  const [editing, setEditing] = React.useState<AdminPersonaKeyword | null>(null);

  return (
    <section className="flex h-full min-h-[14rem] flex-col gap-4">
      <div>
        <h3 className="font-display text-headline-sm text-on-surface">
          {title}
          <span className="ml-2 text-body-sm font-normal text-on-surface-variant">
            {filtered.length}
          </span>
        </h3>
        <p className="mt-1 text-body-sm text-on-surface-variant">{description}</p>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <AddKeywordRow persona={persona} kind={kind} />
        {filtered.length === 0 ? (
          <p className="text-body-sm text-on-surface-variant/80">None yet.</p>
        ) : (
          <ul className="flex flex-wrap content-start gap-2" aria-label={title}>
            {filtered.map((item) => (
              <li key={item.id}>
                <KeywordChip item={item} onEdit={setEditing} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <EditKeywordDialog
        persona={persona}
        item={editing}
        taxProfileCount={taxProfileCount}
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      />
    </section>
  );
}
