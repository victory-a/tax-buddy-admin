"use client";

import type { ReactNode } from "react";

import { AuthGuard } from "@/components/auth/auth-guard";
import { AuthSessionProvider } from "@/components/auth/auth-session-provider";
import { AdminShell } from "@/components/shell/admin-shell";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <AuthSessionProvider>
      <AuthGuard>
        <AdminShell>{children}</AdminShell>
      </AuthGuard>
    </AuthSessionProvider>
  );
}
