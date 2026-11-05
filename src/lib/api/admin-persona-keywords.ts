"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/api/client";
import type { ServiceEnvelope } from "@/lib/api/types";
import type { AdminPersona } from "@/lib/persona-labels";

export type AdminPersonaKeyword = {
  id: string;
  persona: AdminPersona;
  keywordLabel: string;
  kind: "include" | "exclude";
  weight: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminPersonaKeywordList = {
  persona: AdminPersona;
  taxProfileCount: number;
  items: AdminPersonaKeyword[];
};

export function adminPersonaKeywordsKey(persona: AdminPersona) {
  return ["admin", "persona-keywords", persona] as const;
}

export function useAdminPersonaKeywords(persona: AdminPersona) {
  return useQuery({
    queryKey: adminPersonaKeywordsKey(persona),
    queryFn: async () => {
      const { data } = await client.get<ServiceEnvelope<AdminPersonaKeywordList>>(
        "/admin/persona-keywords",
        { params: { persona } },
      );
      return data.responseObject;
    },
  });
}

export function useCreateAdminPersonaKeyword(persona: AdminPersona) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { keywordLabel: string; kind: "include" | "exclude"; weight: number }) => {
      const { data } = await client.post<ServiceEnvelope<AdminPersonaKeyword>>("/admin/persona-keywords", {
        persona,
        ...input,
      });
      return data.responseObject;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminPersonaKeywordsKey(persona) });
    },
  });
}

export function useUpdateAdminPersonaKeyword(persona: AdminPersona) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; keywordLabel?: string; weight?: number }) => {
      const { id, ...body } = input;
      const { data } = await client.patch<ServiceEnvelope<AdminPersonaKeyword>>(
        `/admin/persona-keywords/${id}`,
        body,
      );
      return data.responseObject;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminPersonaKeywordsKey(persona) });
    },
  });
}

export function useDeleteAdminPersonaKeyword(persona: AdminPersona) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await client.delete<
        ServiceEnvelope<{ id: string; taxProfileCount: number; overrideCount: number }>
      >(`/admin/persona-keywords/${id}`);
      return data.responseObject;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminPersonaKeywordsKey(persona) });
    },
  });
}
