"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { authMeQueryKey, fetchAuthMe, type AuthUser } from "@/lib/api/session";

export type AuthSessionContextValue = {
  user: AuthUser | undefined;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  refetch: () => void;
};

const AuthSessionContext = React.createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending, isError, isSuccess, refetch } = useQuery({
    queryKey: authMeQueryKey,
    queryFn: fetchAuthMe,
    retry: false,
  });

  const value = React.useMemo(
    () =>
      ({
        user: data,
        isPending,
        isError,
        isSuccess,
        refetch,
      }) satisfies AuthSessionContextValue,
    [data, isPending, isError, isSuccess, refetch],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession(): AuthSessionContextValue {
  const ctx = React.useContext(AuthSessionContext);
  if (ctx == null) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }
  return ctx;
}
