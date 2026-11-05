"use client";

import * as React from "react";

import { formatDate } from "@/components/queues/queue-format";
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
  useAdminClassificationBatches,
  useReleaseBatchLease,
  useRequeueFailedBatch,
} from "@/lib/api/admin-queues";
import { showToast } from "@/lib/toast";

export function BatchesPanel() {
  const [status, setStatus] = React.useState<"leased" | "queued" | "failed">("leased");
  const [page, setPage] = React.useState(1);
  const { data, isPending, isError, error, refetch, isFetching } = useAdminClassificationBatches(
    status,
    page,
  );
  const releaseLease = useReleaseBatchLease();
  const requeue = useRequeueFailedBatch();

  return (
    <section className="flex flex-col gap-4">
      <StatusPills
        value={status}
        options={[
          { value: "leased", label: "Leased" },
          { value: "queued", label: "Queued" },
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
          message={error instanceof Error ? error.message : "Could not load batches."}
          onRetry={() => void refetch()}
        />
      ) : (
        <>
          <Table appearance="plain">
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attempt</TableHead>
                <TableHead>Lease</TableHead>
                <TableHead>Error</TableHead>
                <TableHead className="w-[140px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-on-surface-variant">
                    No {status} batches.
                  </TableCell>
                </TableRow>
              ) : (
                data.items.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell>
                      <span className="font-medium">{batch.requesterEmail}</span>
                      <span className="block text-body-sm text-on-surface-variant">
                        job {batch.jobStatus} · {batch.rowCount} rows
                      </span>
                    </TableCell>
                    <TableCell>{batch.status}</TableCell>
                    <TableCell>{batch.attempt}</TableCell>
                    <TableCell className="text-body-sm">
                      {batch.leaseOwner ? (
                        <>
                          <span className="block truncate max-w-[140px]">{batch.leaseOwner}</span>
                          <span className="text-on-surface-variant">
                            exp {formatDate(batch.leaseExpiresAt)}
                          </span>
                        </>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate text-body-sm text-on-surface-variant">
                      {batch.lastError ?? "—"}
                    </TableCell>
                    <TableCell>
                      {batch.status === "leased" ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outlined"
                          disabled={releaseLease.isPending}
                          onClick={() =>
                            void releaseLease.mutateAsync(batch.id).then(() =>
                              showToast({ value: "Lease released", variant: "success" }),
                            )
                          }
                        >
                          Release
                        </Button>
                      ) : null}
                      {batch.status === "failed" ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          disabled={requeue.isPending}
                          onClick={() =>
                            void requeue.mutateAsync(batch.id).then(() =>
                              showToast({ value: "Batch requeued", variant: "success" }),
                            )
                          }
                        >
                          Requeue
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
