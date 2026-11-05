import { UserPanel } from "@/components/users/user-panel";
import type { AdminUserDetail } from "@/lib/api/admin-users";

export function UserProfilesSection({ user }: { user: AdminUserDetail }) {
  return (
    <UserPanel title="Profiles" description="Tax profiles owned by this account.">
      {user.profiles.length === 0 ? (
        <p className="text-body-md text-on-surface-variant">No profiles.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {user.profiles.map((profile) => (
            <li
              key={profile.id}
              className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest/70 px-4 py-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-on-surface">
                  {profile.name}
                  {profile.isDefault ? (
                    <span className="ml-2 text-body-sm font-normal text-on-surface-variant">
                      default
                    </span>
                  ) : null}
                </p>
                <span className="text-body-sm capitalize text-on-surface-variant">
                  {profile.kind}
                </span>
              </div>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                <span className="font-tabular">{profile.ingestionJobCount}</span> import
                {profile.ingestionJobCount === 1 ? "" : "s"}
                <span className="mx-1.5 text-outline-variant">·</span>
                <span className="font-tabular">{profile.transactionCount}</span> ledger row
                {profile.transactionCount === 1 ? "" : "s"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </UserPanel>
  );
}
