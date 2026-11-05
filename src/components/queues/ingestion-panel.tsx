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
import { useAdminIngestionJobs, useFailIngestionJob } from "@/lib/api/admin-queues";
import { showToast } from "@/lib/toast";

export function IngestionPanel() {
  const [status, setStatus] = React.useState<"processing" | "failed">("processing");
  const [page, setPage] = React.useState(1);
  const { data, isPending, isError, error, refetch, isFetching } = useAdminIngestionJobs(status, page);
  const failJob = useFailIngestionJob();

  return (
    <section className="flex flex-col gap-4">
      <StatusPills
        value={status}
        options={[
          { value: "processing", label: "Processing" },
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
                <TableHead>File</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Error</TableHead>
                <TableHead className="w-[120px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-on-surface-variant">
                    No {status} ingestion jobs.
                  </TableCell>
                </TableRow>
              ) : (
                data.items.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{job.fileName}</span>
                        <span className="text-body-sm text-on-surface-variant">
                          {job.persona}
                          {job.customerName ? ` · ${job.customerName}` : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/users/${job.ownerUserId}`} className="hover:underline">
                        {job.ownerEmail}
                      </Link>
                      <span className="block text-body-sm text-on-surface-variant">
                        {job.taxProfileName}
                      </span>
                    </TableCell>
                    <TableCell>{formatAge(job.ageMs)}</TableCell>
                    <TableCell className="max-w-[220px] truncate text-body-sm text-on-surface-variant">
                      {job.errorMessage ?? "—"}
                    </TableCell>
                    <TableCell>
                      {job.status === "processing" ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          disabled={failJob.isPending}
                          onClick={() =>
                            void failJob.mutateAsync(job.id).then(() =>
                              showToast({ value: "Ingestion job marked failed", variant: "success" }),
                            )
                          }
                        >
                          Fail
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
