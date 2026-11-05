"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthSession } from "@/components/auth/auth-session-provider";

function AuthLoading() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-[50vh] px-4">
      <div className="h-10 w-48 rounded-lg bg-surface-container-high animate-pulse" />
    </main>
  );
}

/**
 * Blocks authenticated routes until `GET /api/auth/me` succeeds.
 * Non-admins are sent to `/forbidden` (403 UX). Missing session → `/login`.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isPending, isError } = useAuthSession();
  const onForbidden = pathname === "/forbidden";

  React.useEffect(() => {
    if (isPending) return;

    if (!user) {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const next = encodeURIComponent(`${pathname}${search}`);
      router.replace(`/login?next=${next}`);
      return;
    }

    if (!user.isAdmin && !onForbidden) {
      router.replace("/forbidden");
      return;
    }

    if (user.isAdmin && onForbidden) {
      router.replace("/overview");
    }
  }, [isPending, isError, user, pathname, onForbidden, router]);

  if (isPending) {
    return <AuthLoading />;
  }

  if (!user) {
    return null;
  }

  if (!user.isAdmin && !onForbidden) {
    return null;
  }

  if (user.isAdmin && onForbidden) {
    return null;
  }

  return <>{children}</>;
}
