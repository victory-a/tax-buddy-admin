import { Suspense } from "react";

import { RulesView } from "@/components/rules/rules-view";

export default function RulesPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 w-full">
          <div className="h-40 rounded-2xl bg-surface-container-high animate-pulse" />
        </main>
      }
    >
      <RulesView />
    </Suspense>
  );
}
