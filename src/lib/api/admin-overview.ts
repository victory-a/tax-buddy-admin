"use client";

import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/api/client";
import type { ServiceEnvelope } from "@/lib/api/types";

export type AdminOverview = {
  checkedAt: string;
  database: {
    reachable: boolean;
    latencyMs?: number;
    lastError?: string | null;
  };
  models: {
    providerState: string;
    providerMessage: string;
    classifierState: string;
    classifierMessage: string;
    pdfParserState: string;
    pdfParserMessage: string;
    llmConfigured: boolean;
  };
  queues: {
    ingestionProcessing: number;
    ingestionFailed: number;
    classificationQueued: number;
    classificationProcessing: number;
    classificationFailed: number;
    batchesQueued: number;
    batchesLeased: number;
    batchesFailed: number;
  };
  metrics24h: {
    signups: number;
    paidUsers: number;
    freeUsers: number;
    freeExhausted: number;
    failedUploads: number;
    freeUsesLimit: number;
  };
};

export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const { data } = await client.get<ServiceEnvelope<AdminOverview>>("/admin/overview");
      return data.responseObject;
    },
    refetchInterval: 30_000,
  });
}
