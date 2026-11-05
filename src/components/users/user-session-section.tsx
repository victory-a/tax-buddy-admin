"use client";

import { formatDate } from "@/components/users/user-format";
import { UserDetail, UserPanel } from "@/components/users/user-panel";
import { Button } from "@/components/ui";
import type { AdminUserDetail } from "@/lib/api/admin-users";
import { useRevokeSession } from "@/lib/api/admin-users";
import { showToast } from "@/lib/toast";

export function UserSessionSection({ user }: { user: AdminUserDetail }) {
  const revokeSession = useRevokeSession(user.id);

  return (
    <UserPanel
      title="Session"
      description="Active browser session for this account."
      action={
        user.session ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={revokeSession.isPending}
            onClick={() =>
              void revokeSession.mutateAsync().then(() =>
                showToast({ value: "Session revoked", variant: "success" }),
              )
            }
          >
            Revoke
          </Button>
        ) : null
      }
    >
      {user.session ? (
        <dl className="grid gap-4 sm:grid-cols-2">
          <UserDetail label="Created" value={formatDate(user.session.createdAt)} />
          <UserDetail label="Expires" value={formatDate(user.session.expiresAt)} />
          <UserDetail label="IP" value={user.session.ipAddress ?? "—"} />
          <UserDetail
            label="User agent"
            value={
              <span className="text-body-sm text-on-surface-variant">
                {user.session.userAgent ?? "—"}
              </span>
            }
          />
        </dl>
      ) : (
        <p className="text-body-md text-on-surface-variant">No active session.</p>
      )}
    </UserPanel>
  );
}
