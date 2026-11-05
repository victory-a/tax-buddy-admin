"use client";

import Link from "next/link";

import { UserAccountSection } from "@/components/users/user-account-section";
import { UserBillingSection } from "@/components/users/user-billing-section";
import { UserClassificationSection } from "@/components/users/user-classification-section";
import { UserProfilesSection } from "@/components/users/user-profiles-section";
import { UserSessionSection } from "@/components/users/user-session-section";
import { Button } from "@/components/ui";
import { useAdminUser } from "@/lib/api/admin-users";

export function UserDetailView({ userId }: { userId: string }) {
  const { data: user, isPending, isError, error, refetch } = useAdminUser(userId);

  if (isPending) {
    return (
      <main className="flex flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 max-w-5xl">
        <div className="space-y-4" aria-hidden>
          <div className="h-16 animate-pulse rounded-2xl bg-surface-container" />
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-48 animate-pulse rounded-2xl bg-surface-container" />
            <div className="h-48 animate-pulse rounded-2xl bg-surface-container" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !user) {
    return (
      <main className="flex flex-1 flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8 max-w-5xl">
        <Link
          href="/users"
          className="w-fit text-body-sm text-on-surface-variant hover:text-on-surface"
        >
          ← Users
        </Link>
        <p className="text-body-md text-error">
          {error instanceof Error ? error.message : "User not found."}
        </p>
        <Button type="button" variant="outlined" size="sm" onClick={() => void refetch()}>
          Retry
        </Button>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 max-w-5xl">
      <header className="flex flex-col gap-2">
        <Link
          href="/users"
          className="w-fit text-body-sm text-on-surface-variant hover:text-on-surface"
        >
          ← Users
        </Link>
        <h1 className="font-display text-headline-lg tracking-tight text-on-surface">
          {user.name?.trim() || user.email}
        </h1>
        {user.name?.trim() ? (
          <p className="text-body-md text-on-surface-variant">{user.email}</p>
        ) : null}
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <UserAccountSection user={user} />
        <UserBillingSection user={user} />
        <UserSessionSection user={user} />
        <UserClassificationSection user={user} />
      </div>

      <UserProfilesSection user={user} />
    </main>
  );
}
