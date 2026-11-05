"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/api/client";
import type { ServiceEnvelope } from "@/lib/api/types";

export type AdminUserSummary = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
  isPaid: boolean;
  paidUntil: string | null;
  freeUsesUsed: number;
  freeUsesLimit: number;
  canUse: boolean;
  isAdmin: boolean;
};

export type AdminUserProfile = {
  id: string;
  name: string;
  kind: "personal" | "business" | "other";
  isDefault: boolean;
  ingestionJobCount: number;
  transactionCount: number;
};

export type AdminUserSession = {
  id: string;
  createdAt: string;
  expiresAt: string;
  userAgent: string | null;
  ipAddress: string | null;
};

export type AdminUserLastClassificationJob = {
  id: string;
  status: "queued" | "processing" | "complete" | "failed";
  scope: string;
  createdAt: string;
  completedAt: string | null;
  errorMessage: string | null;
};

export type AdminUserDetail = AdminUserSummary & {
  googleId: string | null;
  profiles: AdminUserProfile[];
  session: AdminUserSession | null;
  lastClassificationJob: AdminUserLastClassificationJob | null;
};

export type AdminUserList = {
  items: AdminUserSummary[];
  total: number;
  page: number;
  pageSize: number;
  freeUsesLimit: number;
};

export const adminUsersQueryKey = ["admin", "users"] as const;

export function adminUserQueryKey(userId: string) {
  return ["admin", "users", userId] as const;
}

export async function fetchAdminUsers(input: {
  q?: string;
  page?: number;
  pageSize?: number;
}): Promise<AdminUserList> {
  const { data } = await client.get<ServiceEnvelope<AdminUserList>>("/admin/users", {
    params: {
      q: input.q || undefined,
      page: input.page ?? 1,
      pageSize: input.pageSize ?? 20,
    },
  });
  return data.responseObject;
}

export async function fetchAdminUser(userId: string): Promise<AdminUserDetail> {
  const { data } = await client.get<ServiceEnvelope<AdminUserDetail>>(`/admin/users/${userId}`);
  return data.responseObject;
}

async function postUserAction(
  userId: string,
  path: string,
  body?: Record<string, unknown>,
): Promise<AdminUserDetail> {
  const { data } = await client.post<ServiceEnvelope<AdminUserDetail>>(
    `/admin/users/${userId}/${path}`,
    body ?? {},
  );
  return data.responseObject;
}

export function useAdminUsers(input: { q: string; page: number }) {
  return useQuery({
    queryKey: [...adminUsersQueryKey, input.q, input.page],
    queryFn: () => fetchAdminUsers({ q: input.q, page: input.page }),
  });
}

export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: adminUserQueryKey(userId),
    queryFn: () => fetchAdminUser(userId),
    enabled: Boolean(userId),
  });
}

function useInvalidateUser(userId: string) {
  const queryClient = useQueryClient();
  return (detail: AdminUserDetail) => {
    queryClient.setQueryData(adminUserQueryKey(userId), detail);
    void queryClient.invalidateQueries({ queryKey: adminUsersQueryKey });
  };
}

export function useGrantPaid(userId: string) {
  const onSuccess = useInvalidateUser(userId);
  return useMutation({
    mutationFn: (paidUntil: string | null) => postUserAction(userId, "grant-paid", { paidUntil }),
    onSuccess,
  });
}

export function useRevokePaid(userId: string) {
  const onSuccess = useInvalidateUser(userId);
  return useMutation({
    mutationFn: () => postUserAction(userId, "revoke-paid"),
    onSuccess,
  });
}

export function useResetFreeUses(userId: string) {
  const onSuccess = useInvalidateUser(userId);
  return useMutation({
    mutationFn: () => postUserAction(userId, "reset-free-uses"),
    onSuccess,
  });
}

export function useRevokeSession(userId: string) {
  const onSuccess = useInvalidateUser(userId);
  return useMutation({
    mutationFn: () => postUserAction(userId, "revoke-session"),
    onSuccess,
  });
}
