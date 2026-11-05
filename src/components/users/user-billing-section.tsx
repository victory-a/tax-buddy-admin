"use client";

import * as React from "react";

import { addDaysIso, formatDate } from "@/components/users/user-format";
import { UserDetail, UserPanel } from "@/components/users/user-panel";
import { Button, TextInput } from "@/components/ui";
import type { AdminUserDetail } from "@/lib/api/admin-users";
import { useGrantPaid, useResetFreeUses, useRevokePaid } from "@/lib/api/admin-users";
import { showToast } from "@/lib/toast";

export function UserBillingSection({ user }: { user: AdminUserDetail }) {
  const grantPaid = useGrantPaid(user.id);
  const revokePaid = useRevokePaid(user.id);
  const resetFreeUses = useResetFreeUses(user.id);
  const [paidUntilLocal, setPaidUntilLocal] = React.useState("");
  const busy = grantPaid.isPending || revokePaid.isPending || resetFreeUses.isPending;

  const run = async (label: string, fn: () => Promise<unknown>) => {
    try {
      await fn();
      showToast({ value: label, variant: "success" });
    } catch {
      // axios interceptor already toasts
    }
  };

  const statusLabel = user.isPaid
    ? user.paidUntil
      ? `Paid until ${formatDate(user.paidUntil)}`
      : "Paid · open-ended"
    : "Free tier";

  return (
    <UserPanel title="Billing" description="Subscription on the User row — not per profile.">
      <dl className="grid gap-4 sm:grid-cols-2">
        <UserDetail label="Status" value={statusLabel} />
        <UserDetail
          label="Free uses"
          value={`${user.freeUsesUsed} / ${user.freeUsesLimit}`}
        />
      </dl>

      <div className="flex flex-col gap-4 border-t border-outline-variant/50 pt-4">
        <TextInput
          label="Grant until"
          name="paidUntil"
          type="datetime-local"
          value={paidUntilLocal}
          onChange={(e) => setPaidUntilLocal(e.target.value)}
          helperText="Local time. Or use a quick grant below."
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={busy || !paidUntilLocal}
            onClick={() =>
              void run("Paid access granted", () =>
                grantPaid.mutateAsync(new Date(paidUntilLocal).toISOString()),
              )
            }
          >
            Grant until date
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={busy}
            onClick={() => {
              setPaidUntilLocal("");
              void run("Paid for 30 days", () => grantPaid.mutateAsync(addDaysIso(30)));
            }}
          >
            +30 days
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={busy}
            onClick={() => void run("Open-ended grant", () => grantPaid.mutateAsync(null))}
          >
            Open-ended
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outlined"
            size="sm"
            disabled={busy || !user.isPaid}
            onClick={() => void run("Paid access revoked", () => revokePaid.mutateAsync())}
          >
            Revoke paid
          </Button>
          <Button
            type="button"
            variant="outlined"
            size="sm"
            disabled={busy || user.freeUsesUsed === 0}
            onClick={() => void run("Free uses reset", () => resetFreeUses.mutateAsync())}
          >
            Reset free uses
          </Button>
        </div>
      </div>
    </UserPanel>
  );
}
