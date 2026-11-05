import { Suspense } from "react";

import { SettingsView } from "@/components/settings/settings-view";

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <div className="h-40 max-w-3xl rounded-2xl bg-surface-container-high animate-pulse" />
        </main>
      }
    >
      <SettingsView />
    </Suspense>
  );
}
