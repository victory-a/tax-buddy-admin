import Link from "next/link";

import { formatDate } from "@/components/users/user-format";
import { UserDetail, UserPanel } from "@/components/users/user-panel";
import type { AdminUserDetail } from "@/lib/api/admin-users";
import { cn } from "@/lib/utils";

const STATUS_DOT: Record<string, string> = {
  queued: "bg-outline",
  processing: "bg-secondary",
  complete: "bg-secondary",
  failed: "bg-error",
};

export function UserClassificationSection({ user }: { user: AdminUserDetail }) {
  const job = user.lastClassificationJob;

  return (
    <UserPanel
      title="Last classification"
      description="Most recent classify job requested by this user."
      action={
        job ? (
          <LinkToQueues status={job.status} />
        ) : null
      }
    >
      {job ? (
        <dl className="grid gap-4 sm:grid-cols-2">
          <UserDetail
            label="Status"
            value={
              <span className="inline-flex items-center gap-2 capitalize">
                <span
                  className={cn("size-2 rounded-full", STATUS_DOT[job.status] ?? "bg-outline")}
                  aria-hidden
                />
                {job.status}
              </span>
            }
          />
          <UserDetail label="Scope" value={job.scope} />
          <UserDetail label="Created" value={formatDate(job.createdAt)} />
          <UserDetail label="Completed" value={formatDate(job.completedAt)} />
          {job.errorMessage ? (
            <div className="sm:col-span-2">
              <UserDetail
                label="Error"
                value={<span className="text-error">{job.errorMessage}</span>}
              />
            </div>
          ) : null}
        </dl>
      ) : (
        <p className="text-body-md text-on-surface-variant">No classification jobs yet.</p>
      )}
    </UserPanel>
  );
}

function LinkToQueues({ status }: { status: string }) {
  if (status !== "queued" && status !== "processing" && status !== "failed") return null;
  return (
    <Link
      href="/queues?tab=jobs"
      className="text-body-sm font-medium text-on-surface-variant underline-offset-2 hover:text-on-surface hover:underline"
    >
      Open queues
    </Link>
  );
}
