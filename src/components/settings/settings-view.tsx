"use client";

import { SettingsSubscriptionPanel } from "@/components/settings/settings-panels";
import { type AdminConfigPatch, useAdminConfig, useUpdateAdminConfig } from "@/lib/api/admin-config";
import { showToast } from "@/lib/toast";

export function SettingsView() {
  const { data, isPending, isError } = useAdminConfig();
  const update = useUpdateAdminConfig();

  function save(patch: AdminConfigPatch) {
    update.mutate(patch, {
      onError: () => {
        showToast({ value: "Could not save setting", variant: "error" });
      },
    });
  }

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2 max-w-3xl">
        <h1 className="font-display text-headline-lg tracking-tight text-on-surface">Settings</h1>
        <p className="text-body-md text-on-surface-variant">
          Subscription limits and gates. Model ids live on Models → Configure. Secrets stay in
          server env.
        </p>
      </header>

      {isPending ? (
        <div className="h-48 max-w-2xl animate-pulse rounded-2xl bg-surface-container" aria-hidden />
      ) : null}

      {isError && !data ? (
        <p className="text-body-md text-error">Settings unavailable. Refresh to try again.</p>
      ) : null}

      {data ? (
        <SettingsSubscriptionPanel config={data} save={save} saving={update.isPending} />
      ) : null}
    </main>
  );
}
