"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AuthGuard } from "@/components/auth/auth-guard";
import { AuthSessionProvider } from "@/components/auth/auth-session-provider";
import { AdminShell } from "@/components/shell/admin-shell";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  const bare = pathname === "/forbidden";

  return (
    <AuthSessionProvider>
      <AuthGuard>{bare ? children : <AdminShell>{children}</AdminShell>}</AuthGuard>
    </AuthSessionProvider>
  );
}
