"use client";

import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/api/client";
import type { ServiceEnvelope } from "@/lib/api/types";

export type ModelConnectionState =
  | "connected"
  | "not_configured"
  | "unauthorized"
  | "unreachable"
  | "unknown_model";

export type ProviderConnectionState = "connected" | "not_configured" | "unauthorized" | "unreachable";

export type AiModelStatus = {
  id: "classifier" | "pdfParser";
  label: string;
  purpose: string;
  model: string;
  maxTokens: number;
  state: ModelConnectionState;
  message: string;
  warning: string | null;
  latencyMs: number | null;
  catalogName: string | null;
  contextLength: number | null;
  inputModalities: string[];
};

export type AiProviderStatus = {
  name: "OpenRouter";
  baseUrl: string;
  state: ProviderConnectionState;
  message: string;
  latencyMs: number | null;
  isFreeTier: boolean | null;
  limit: number | null;
  limitRemaining: number | null;
  usage: number | null;
};

export type AiModelsStatus = {
  checkedAt: string;
  provider: AiProviderStatus;
  models: AiModelStatus[];
};

export type OpenRouterCatalogModel = {
  id: string;
  name: string | null;
  contextLength: number | null;
  inputModalities: string[];
};

export type OpenRouterCatalog = {
  ok: boolean;
  authors: string[];
  message: string | null;
  models: OpenRouterCatalogModel[];
  classifier: OpenRouterCatalogModel[];
  pdfParser: OpenRouterCatalogModel[];
};

export function useModelStatus() {
  return useQuery({
    queryKey: ["admin", "models", "status"],
    queryFn: async () => {
      const { data } = await client.get<ServiceEnvelope<AiModelsStatus>>("/models/status");
      return data.responseObject;
    },
    staleTime: 15_000,
    refetchOnWindowFocus: false,
  });
}

export function useOpenRouterCatalog() {
  return useQuery({
    queryKey: ["admin", "models", "catalog"],
    queryFn: async () => {
      const { data } = await client.get<ServiceEnvelope<OpenRouterCatalog>>("/models/catalog");
      return data.responseObject;
    },
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}
