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

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isPending, isError } = useAuthSession();

  React.useEffect(() => {
    if (isPending || user) return;

    const search = typeof window !== "undefined" ? window.location.search : "";
    const next = encodeURIComponent(`${pathname}${search}`);
    router.replace(`/login?next=${next}`);
  }, [isPending, isError, user, pathname, router]);

  if (isPending) {
    return <AuthLoading />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
