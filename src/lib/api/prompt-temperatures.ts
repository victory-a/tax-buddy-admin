"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/api/client";
import type { ServiceEnvelope } from "@/lib/api/types";

export type PromptTemperatureId = "taxability" | "category";

export type PromptTemperature = {
  id: PromptTemperatureId;
  label: string;
  description: string;
  temperature: number;
};

export type PromptTemperatureList = {
  prompts: PromptTemperature[];
};

const promptKeys = ["admin", "models", "prompts"] as const;

export function usePromptTemperatures() {
  return useQuery({
    queryKey: promptKeys,
    queryFn: async () => {
      const { data } = await client.get<ServiceEnvelope<PromptTemperatureList>>("/models/prompts");
      return data.responseObject;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useUpdatePromptTemperature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: PromptTemperatureId; temperature: number }) => {
      const { data } = await client.patch<ServiceEnvelope<PromptTemperatureList>>(
        "/models/prompts",
        input,
        { skipErrorToast: true },
      );
      return data.responseObject;
    },
    onSuccess: (list) => {
      queryClient.setQueryData(promptKeys, list);
    },
  });
}
