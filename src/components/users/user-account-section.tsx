import { formatDate } from "@/components/users/user-format";
import { UserDetail, UserPanel } from "@/components/users/user-panel";
import type { AdminUserDetail } from "@/lib/api/admin-users";

export function UserAccountSection({ user }: { user: AdminUserDetail }) {
  return (
    <UserPanel title="Account" description="Identity and access flags for this Google account.">
      <dl className="grid gap-4 sm:grid-cols-2">
        <UserDetail label="Email" value={user.email} />
        <UserDetail label="Created" value={formatDate(user.createdAt)} />
        <UserDetail label="Google id" value={user.googleId ?? "—"} />
        <UserDetail
          label="Gated actions"
          value={user.canUse ? "Allowed" : "Blocked (free exhausted / unpaid)"}
        />
        <UserDetail label="Plan" value={user.isPaid ? "Paid" : "Free"} />
        <UserDetail
          label="Session"
          value={user.session ? "Signed in" : "No active session"}
        />
        {user.isAdmin ? <UserDetail label="Staff" value="On ADMIN_EMAILS allowlist" /> : null}
      </dl>
    </UserPanel>
  );
}
