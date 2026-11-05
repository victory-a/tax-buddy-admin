"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuthSession } from "@/components/auth/auth-session-provider";
import { Button } from "@/components/ui";
import { authMeQueryKey, logout } from "@/lib/api/session";

export default function ForbiddenPage() {
  const { user } = useAuthSession();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authMeQueryKey });
      window.location.assign("/login");
    },
  });

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="flex max-w-md flex-col gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
          403
        </p>
        <h1 className="font-display text-headline-lg tracking-tight text-on-surface">
          Not authorized
        </h1>
        <p className="text-body-md text-on-surface-variant">
          {user?.email ? (
            <>
              <span className="text-on-surface">{user.email}</span> is signed in but is not on the
              staff allowlist.
            </>
          ) : (
            <>This account is not on the staff allowlist.</>
          )}{" "}
          Ask an operator to add your email to <code className="text-body-sm">ADMIN_EMAILS</code>,
          then sign in again.
        </p>
      </div>
      <Button
        type="button"
        variant="outlined"
        size="lg"
        disabled={logoutMutation.isPending}
        onClick={() => logoutMutation.mutate()}
      >
        {logoutMutation.isPending ? "Signing out…" : "Sign out"}
      </Button>
    </main>
  );
}
