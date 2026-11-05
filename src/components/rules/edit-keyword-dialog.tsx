"use client";

import * as React from "react";

import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  TextInput,
} from "@/components/ui";
import {
  type AdminPersonaKeyword,
  useDeleteAdminPersonaKeyword,
  useUpdateAdminPersonaKeyword,
} from "@/lib/api/admin-persona-keywords";
import type { AdminPersona } from "@/lib/persona-labels";
import { showToast } from "@/lib/toast";

export function EditKeywordDialog({
  persona,
  item,
  taxProfileCount,
  open,
  onOpenChange,
}: {
  persona: AdminPersona;
  item: AdminPersonaKeyword | null;
  taxProfileCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const update = useUpdateAdminPersonaKeyword(persona);
  const remove = useDeleteAdminPersonaKeyword(persona);
  const [label, setLabel] = React.useState("");
  const [weight, setWeight] = React.useState("1");
  const busy = update.isPending || remove.isPending;

  React.useEffect(() => {
    if (!open || !item) return;
    setLabel(item.keywordLabel);
    setWeight(String(item.weight));
  }, [open, item]);

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" closeOnOverlayClick>
        <DialogHeader>
          <DialogTitle>Edit keyword</DialogTitle>
          <DialogDescription>
            {item.kind === "include" ? "Include" : "Exclude"} phrase for this persona bank.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              const keywordLabel = label.trim();
              const nextWeight = Math.min(100, Math.max(1, Number(weight) || 1));
              if (!keywordLabel) return;
              if (keywordLabel === item.keywordLabel && nextWeight === item.weight) {
                onOpenChange(false);
                return;
              }
              void update
                .mutateAsync({
                  id: item.id,
                  keywordLabel,
                  weight: nextWeight,
                })
                .then(() => {
                  showToast({ value: "Keyword updated", variant: "success" });
                  onOpenChange(false);
                });
            }}
          >
            <TextInput
              label="Name"
              name="keywordLabel"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              autoFocus
            />
            <TextInput
              label="Weight"
              name="weight"
              type="number"
              min={1}
              max={100}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              helperText="Higher weight ranks the phrase more strongly. Default is 1."
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <Button type="submit" size="sm" disabled={busy || !label.trim()}>
                Save
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={busy}
                onClick={() => {
                  const ok = window.confirm(
                    `Delete “${item.keywordLabel}” from this persona bank?\n\n${taxProfileCount} profile${taxProfileCount === 1 ? "" : "s"} import this persona. Personal overrides with the same label stay.`,
                  );
                  if (!ok) return;
                  void remove.mutateAsync(item.id).then(() => {
                    showToast({ value: "Keyword deleted", variant: "success" });
                    onOpenChange(false);
                  });
                }}
              >
                Delete
              </Button>
            </div>
          </form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
