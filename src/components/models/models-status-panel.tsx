"use client";

import { ModelCard } from "@/components/models/model-card";
import { ProviderCard } from "@/components/models/provider-card";
import { useModelStatus } from "@/lib/api/models";

export function ModelsStatusPanel() {
  const { data, isPending, isError } = useModelStatus();

  if (isPending) {
    return (
      <div className="space-y-4" aria-hidden>
        <div className="h-40 animate-pulse rounded-2xl bg-surface-container" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-2xl bg-surface-container" />
          <div className="h-64 animate-pulse rounded-2xl bg-surface-container" />
        </div>
      </div>
    );
  }

  if (isError && !data) {
    return <p className="text-body-md text-error">Status unavailable. Refresh to try again.</p>;
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      <ProviderCard provider={data.provider} checkedAt={data.checkedAt} />
      <div className="grid gap-4 lg:grid-cols-2">
        {data.models.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  );
}
