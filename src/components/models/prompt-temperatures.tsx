"use client";

import * as React from "react";

import { TextInput } from "@/components/ui";
import {
  type PromptTemperature,
  type PromptTemperatureId,
  usePromptTemperatures,
  useUpdatePromptTemperature,
} from "@/lib/api/prompt-temperatures";
import { showToast } from "@/lib/toast";

function formatTemperature(value: number): string {
  return value.toFixed(1);
}

function clampTemperature(value: number): number {
  return Math.round(Math.min(2, Math.max(0, value)) * 10) / 10;
}

function PromptTemperatureRow({ prompt }: { prompt: PromptTemperature }) {
  const update = useUpdatePromptTemperature();
  const [draft, setDraft] = React.useState(formatTemperature(prompt.temperature));

  function commit(id: PromptTemperatureId, raw: string) {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      setDraft(formatTemperature(prompt.temperature));
      return;
    }
    const temperature = clampTemperature(parsed);
    setDraft(formatTemperature(temperature));
    if (temperature === prompt.temperature) return;
    update.mutate(
      { id, temperature },
      {
        onError: () => {
          setDraft(formatTemperature(prompt.temperature));
          showToast({ value: "Could not save temperature", variant: "error" });
        },
      },
    );
  }

  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="text-body-md font-medium text-on-surface">{prompt.label}</p>
        <p className="mt-0.5 text-body-sm text-on-surface-variant">{prompt.description}</p>
      </div>
      <TextInput
        type="number"
        inputMode="decimal"
        min={0}
        max={2}
        step={0.1}
        value={draft}
        inputSize="sm"
        containerClassName="w-14 shrink-0"
        className="tabular-nums px-2"
        onChange={(event) => setDraft(event.target.value)}
        onBlur={(event) => commit(prompt.id, event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
      />
    </div>
  );
}

export function ModelPromptTemperatures({ ids }: { ids: readonly PromptTemperatureId[] }) {
  const { data, isPending, isError } = usePromptTemperatures();
  const prompts = data?.prompts.filter((prompt) => ids.includes(prompt.id)) ?? [];

  if (isPending) {
    return <div className="mt-6 h-16 animate-pulse rounded-xl bg-surface-container" aria-hidden />;
  }
  if (isError && prompts.length === 0) {
    return (
      <p className="mt-6 text-body-sm text-on-surface-variant">Temperatures did not load.</p>
    );
  }
  if (prompts.length === 0) return null;

  return (
    <div className="mt-6 space-y-5 border-t border-outline-variant/60 pt-6">
      {prompts.map((prompt) => (
        <PromptTemperatureRow key={`${prompt.id}-${prompt.temperature}`} prompt={prompt} />
      ))}
    </div>
  );
}
