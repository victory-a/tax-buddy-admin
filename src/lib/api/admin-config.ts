"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/api/client";
import type { ServiceEnvelope } from "@/lib/api/types";

export type AdminConfig = {
  subscriptionFreeUses: number;
  subscriptionEnforcement: boolean;
  classifierModel: string;
  classifierMaxTokens: number;
  pdfParserModel: string;
  pdfParserMaxTokens: number;
};

export type AdminConfigPatch = Partial<AdminConfig>;

const configKeys = ["admin", "config"] as const;

export function useAdminConfig() {
  return useQuery({
    queryKey: configKeys,
    queryFn: async () => {
      const { data } = await client.get<ServiceEnvelope<AdminConfig>>("/admin/config");
      return data.responseObject;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateAdminConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (patch: AdminConfigPatch) => {
      const { data } = await client.patch<ServiceEnvelope<AdminConfig>>("/admin/config", patch, {
        skipErrorToast: true,
      });
      return data.responseObject;
    },
    onSuccess: (config) => {
      queryClient.setQueryData(configKeys, config);
    },
  });
}
