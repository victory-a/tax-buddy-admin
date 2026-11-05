import { client } from "@/lib/api/client";
import type { ServiceEnvelope } from "@/lib/api/types";

/** Mirrors `GET /auth/me` (admin fields only — profiles ignored here). */
export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  isPaid: boolean;
  freeUsesUsed: number;
  freeUsesLimit: number;
  canUse: boolean;
  /** True when email is on backend `ADMIN_EMAILS`. */
  isAdmin: boolean;
};

export const authMeQueryKey = ["auth", "me"] as const;

export async function fetchAuthMe(): Promise<AuthUser> {
  const { data } = await client.get<ServiceEnvelope<AuthUser>>("/auth/me", {
    skipErrorToast: true,
  });
  return data.responseObject;
}

export async function logout(): Promise<void> {
  await client.post<ServiceEnvelope<null>>("/auth/logout");
}
