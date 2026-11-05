"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { authMeQueryKey, fetchAuthMe } from "@/lib/api/session";
import { APP_HOME_PATH } from "@/lib/app-home";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const { data: user, isPending } = useQuery({
    queryKey: authMeQueryKey,
    queryFn: fetchAuthMe,
    retry: false,
  });

  React.useEffect(() => {
    if (!user) return;
    const destination = next?.trim() || APP_HOME_PATH;
    router.replace(destination);
  }, [user, next, router]);

  if (isPending) {
    return (
      <main className="flex-1 w-full flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-md h-[320px] rounded-2xl border border-outline-variant/60 bg-surface-container-lowest animate-pulse" />
      </main>
    );
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
}
