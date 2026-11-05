"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/api/client";
import type { ServiceEnvelope } from "@/lib/api/types";

export type AdminIngestionJob = {
  id: string;
  status: "processing" | "complete" | "failed";
  persona: string;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
  ageMs: number;
  fileName: string;
  customerName: string | null;
  taxProfileId: string;
  taxProfileName: string;
  ownerUserId: string;
  ownerEmail: string;
};

export type AdminClassificationJob = {
  id: string;
  status: "queued" | "processing" | "complete" | "failed";
  scope: string;
  enqueueCount: number;
  processedCount: number;
  errorMessage: string | null;
  importJobId: string | null;
  lastClaimedAt: string | null;
  waitSinceClaimMs: number | null;
  createdAt: string;
  completedAt: string | null;
  taxProfileId: string;
  taxProfileName: string;
  requestedByUserId: string;
  requesterEmail: string;
  openBatchCount: number;
};

export type AdminClassificationBatch = {
  id: string;
  jobId: string;
  status: "queued" | "leased" | "complete" | "failed" | "cancelled";
  attempt: number;
  rowCount: number;
  availableAt: string;
  leaseOwner: string | null;
  leaseExpiresAt: string | null;
  lastError: string | null;
  createdAt: string;
  requesterEmail: string;
  jobStatus: "queued" | "processing" | "complete" | "failed";
};

type Page<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export const adminQueuesQueryKey = ["admin", "queues"] as const;

async function getPage<T>(path: string, params: Record<string, string | number>): Promise<Page<T>> {
  const { data } = await client.get<ServiceEnvelope<Page<T>>>(path, { params });
  return data.responseObject;
}

export function useAdminIngestionJobs(status: "processing" | "failed", page: number) {
  return useQuery({
    queryKey: [...adminQueuesQueryKey, "ingestion", status, page],
    queryFn: () => getPage<AdminIngestionJob>("/admin/queues/ingestion", { status, page }),
  });
}

export function useAdminClassificationJobs(
  status: "active" | "queued" | "processing" | "failed",
  page: number,
) {
  return useQuery({
    queryKey: [...adminQueuesQueryKey, "classification-jobs", status, page],
    queryFn: () => getPage<AdminClassificationJob>("/admin/queues/classification/jobs", { status, page }),
  });
}

export function useAdminClassificationBatches(
  status: "queued" | "leased" | "failed",
  page: number,
) {
  return useQuery({
    queryKey: [...adminQueuesQueryKey, "classification-batches", status, page],
    queryFn: () =>
      getPage<AdminClassificationBatch>("/admin/queues/classification/batches", { status, page }),
  });
}

function useInvalidateQueues() {
  const queryClient = useQueryClient();
  return () => void queryClient.invalidateQueries({ queryKey: adminQueuesQueryKey });
}

export function useFailIngestionJob() {
  const invalidate = useInvalidateQueues();
  return useMutation({
    mutationFn: async (jobId: string) => {
      await client.post(`/admin/queues/ingestion/${jobId}/fail`);
    },
    onSuccess: invalidate,
  });
}

export function useCancelClassificationJob() {
  const invalidate = useInvalidateQueues();
  return useMutation({
    mutationFn: async (jobId: string) => {
      await client.post(`/admin/queues/classification/jobs/${jobId}/cancel`);
    },
    onSuccess: invalidate,
  });
}

export function useReleaseBatchLease() {
  const invalidate = useInvalidateQueues();
  return useMutation({
    mutationFn: async (batchId: string) => {
      await client.post(`/admin/queues/classification/batches/${batchId}/release-lease`);
    },
    onSuccess: invalidate,
  });
}

export function useRequeueFailedBatch() {
  const invalidate = useInvalidateQueues();
  return useMutation({
    mutationFn: async (batchId: string) => {
      await client.post(`/admin/queues/classification/batches/${batchId}/requeue`);
    },
    onSuccess: invalidate,
  });
}
