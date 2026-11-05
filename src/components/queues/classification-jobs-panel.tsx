"use client";

import * as React from "react";
import Link from "next/link";

import { formatAge } from "@/components/queues/queue-format";
import { ErrorBlock, QueuePager, StatusPills } from "@/components/queues/queue-ui";
import { Button } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAdminClassificationJobs,
  useCancelClassificationJob,
} from "@/lib/api/admin-queues";
import { showToast } from "@/lib/toast";

export function ClassificationJobsPanel() {
  const [status, setStatus] = React.useState<"active" | "failed">("active");
  const [page, setPage] = React.useState(1);
  const { data, isPending, isError, error, refetch, isFetching } = useAdminClassificationJobs(
    status,
    page,
  );
  const cancelJob = useCancelClassificationJob();

  return (
    <section className="flex flex-col gap-4">
      <StatusPills
        value={status}
        options={[
          { value: "active", label: "Active" },
          { value: "failed", label: "Failed" },
        ]}
        onChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
      />

      {isPending ? (
        <div className="h-40 rounded-2xl bg-surface-container-high animate-pulse" />
      ) : isError ? (
        <ErrorBlock
          message={error instanceof Error ? error.message : "Could not load jobs."}
          onRetry={() => void refetch()}
        />
      ) : (
        <>
          <Table appearance="plain">
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Wait</TableHead>
                <TableHead className="w-[120px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-on-surface-variant">
                    No {status} classification jobs.
                  </TableCell>
                </TableRow>
              ) : (
                data.items.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <Link href={`/users/${job.requestedByUserId}`} className="hover:underline">
                        {job.requesterEmail}
                      </Link>
                      <span className="block text-body-sm text-on-surface-variant">
                        {job.taxProfileName}
                      </span>
                    </TableCell>
                    <TableCell>{job.status}</TableCell>
                    <TableCell className="text-body-sm">{job.scope}</TableCell>
                    <TableCell className="text-body-sm">
                      {job.processedCount}/{job.enqueueCount}
                      {job.openBatchCount > 0 ? (
                        <span className="block text-on-surface-variant">
                          {job.openBatchCount} open batch{job.openBatchCount === 1 ? "" : "es"}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-body-sm">
                      {job.waitSinceClaimMs != null ? formatAge(job.waitSinceClaimMs) : "—"}
                    </TableCell>
                    <TableCell>
                      {job.status === "queued" || job.status === "processing" ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          disabled={cancelJob.isPending}
                          onClick={() =>
                            void cancelJob.mutateAsync(job.id).then(() =>
                              showToast({
                                value: "Classification job cancelled",
                                variant: "success",
                              }),
                            )
                          }
                        >
                          Cancel
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <QueuePager
            page={page}
            pageSize={data.pageSize}
            total={data.total}
            fetching={isFetching}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}
