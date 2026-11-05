"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

import { DirtyFieldLabel, SettingsSection, SettingsTextField } from "@/components/settings/settings-field";
import { Button, SearchableSelect, type SearchableSelectOption } from "@/components/ui";
import {
  type AdminConfig,
  type AdminConfigPatch,
  useAdminConfig,
  useUpdateAdminConfig,
} from "@/lib/api/admin-config";
import { type OpenRouterCatalogModel, useOpenRouterCatalog } from "@/lib/api/models";
import {
  type PromptTemperature,
  type PromptTemperatureId,
  usePromptTemperatures,
  useUpdatePromptTemperature,
} from "@/lib/api/prompt-temperatures";
import { showToast } from "@/lib/toast";

type ModelsDraft = {
  classifierModel: string;
  classifierMaxTokens: string;
  pdfParserModel: string;
  pdfParserMaxTokens: string;
  taxabilityTemperature: string;
  categoryTemperature: string;
};

function formatTemperature(value: number): string {
  return value.toFixed(1);
}

function clampTemperature(value: number): number {
  return Math.round(Math.min(2, Math.max(0, value)) * 10) / 10;
}

function draftFromSources(
  config: AdminConfig,
  prompts: PromptTemperature[],
): ModelsDraft {
  const byId = new Map(prompts.map((prompt) => [prompt.id, prompt.temperature]));
  return {
    classifierModel: config.classifierModel,
    classifierMaxTokens: String(config.classifierMaxTokens),
    pdfParserModel: config.pdfParserModel,
    pdfParserMaxTokens: String(config.pdfParserMaxTokens),
    taxabilityTemperature: formatTemperature(byId.get("taxability") ?? 0),
    categoryTemperature: formatTemperature(byId.get("category") ?? 0),
  };
}

function textChanged(draft: string, saved: string): boolean {
  return draft.trim() !== saved;
}

function intChanged(draft: string, saved: number): boolean {
  const next = Number(draft);
  return Number.isFinite(next) && Math.round(next) !== saved;
}

function temperatureChanged(draft: string, saved: number): boolean {
  const next = Number(draft);
  if (!Number.isFinite(next)) return draft.trim() !== formatTemperature(saved);
  return clampTemperature(next) !== saved;
}

function buildConfigPatch(saved: AdminConfig, draft: ModelsDraft): AdminConfigPatch | null {
  const patch: AdminConfigPatch = {};

  if (textChanged(draft.classifierModel, saved.classifierModel)) {
    patch.classifierModel = draft.classifierModel.trim();
  }
  if (intChanged(draft.classifierMaxTokens, saved.classifierMaxTokens)) {
    patch.classifierMaxTokens = Math.round(Number(draft.classifierMaxTokens));
  }
  if (textChanged(draft.pdfParserModel, saved.pdfParserModel)) {
    patch.pdfParserModel = draft.pdfParserModel.trim();
  }
  if (intChanged(draft.pdfParserMaxTokens, saved.pdfParserMaxTokens)) {
    patch.pdfParserMaxTokens = Math.round(Number(draft.pdfParserMaxTokens));
  }

  return Object.keys(patch).length > 0 ? patch : null;
}

function temperatureUpdates(
  prompts: PromptTemperature[],
  draft: ModelsDraft,
): Array<{ id: PromptTemperatureId; temperature: number }> {
  const byId = new Map(prompts.map((prompt) => [prompt.id, prompt.temperature]));
  const updates: Array<{ id: PromptTemperatureId; temperature: number }> = [];

  const taxability = byId.get("taxability") ?? 0;
  if (temperatureChanged(draft.taxabilityTemperature, taxability)) {
    const next = Number(draft.taxabilityTemperature);
    if (Number.isFinite(next)) updates.push({ id: "taxability", temperature: clampTemperature(next) });
  }

  const category = byId.get("category") ?? 0;
  if (temperatureChanged(draft.categoryTemperature, category)) {
    const next = Number(draft.categoryTemperature);
    if (Number.isFinite(next)) updates.push({ id: "category", temperature: clampTemperature(next) });
  }

  return updates;
}

function toOptions(
  models: OpenRouterCatalogModel[] | undefined,
  current: string,
): SearchableSelectOption[] {
  const byId = new Map<string, SearchableSelectOption>();
  for (const model of models ?? []) {
    byId.set(model.id, {
      value: model.id,
      label: model.id,
      description: model.name ?? undefined,
    });
  }
  const trimmed = current.trim();
  if (trimmed && !byId.has(trimmed)) {
    byId.set(trimmed, { value: trimmed, label: trimmed, description: "Current value (not in catalog)" });
  }
  return [...byId.values()].sort((left, right) => left.value.localeCompare(right.value));
}

export function ModelsConfigPanel() {
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useAdminConfig();
  const promptsQuery = usePromptTemperatures();
  const catalog = useOpenRouterCatalog();
  const update = useUpdateAdminConfig();
  const updateTemperature = useUpdatePromptTemperature();
  const [draft, setDraft] = React.useState<ModelsDraft | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (data && promptsQuery.data) {
      setDraft(draftFromSources(data, promptsQuery.data.prompts));
    }
  }, [data, promptsQuery.data]);

  function setField<K extends keyof ModelsDraft>(key: K, value: ModelsDraft[K]) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  if (isPending || promptsQuery.isPending || !draft) {
    return <div className="h-48 animate-pulse rounded-2xl bg-surface-container" aria-hidden />;
  }

  if ((isError && !data) || (promptsQuery.isError && !promptsQuery.data)) {
    return <p className="text-body-md text-error">Settings unavailable. Refresh to try again.</p>;
  }

  if (!data || !promptsQuery.data) {
    return <p className="text-body-md text-error">Settings unavailable. Refresh to try again.</p>;
  }

  const configPatch = buildConfigPatch(data, draft);
  const tempUpdates = temperatureUpdates(promptsQuery.data.prompts, draft);
  const dirty = configPatch != null || tempUpdates.length > 0;
  const busy = saving || update.isPending || updateTemperature.isPending;

  const taxabilitySaved = promptsQuery.data.prompts.find((p) => p.id === "taxability")?.temperature ?? 0;
  const categorySaved = promptsQuery.data.prompts.find((p) => p.id === "category")?.temperature ?? 0;

  const classifierOptions = toOptions(catalog.data?.classifier, draft.classifierModel);
  const pdfParserOptions = toOptions(catalog.data?.pdfParser, draft.pdfParserModel);

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (!dirty || busy) return;
        setSaving(true);
        void (async () => {
          try {
            if (configPatch) {
              await update.mutateAsync(configPatch);
              void queryClient.invalidateQueries({ queryKey: ["admin", "models"] });
            }
            for (const next of tempUpdates) {
              await updateTemperature.mutateAsync(next);
            }
            showToast({ value: "Model settings saved", variant: "success" });
          } catch {
            showToast({ value: "Could not save settings", variant: "error" });
          } finally {
            setSaving(false);
          }
        })();
      }}
    >
      <SettingsSection
        title="Models"
        description="OpenRouter model ids and completion budgets."
        className="space-y-6"
        contentClassName="grid gap-5 sm:grid-cols-2"
      >
        <SearchableSelect
          label={
            <DirtyFieldLabel
              label="Classifier model"
              dirty={textChanged(draft.classifierModel, data.classifierModel)}
            />
          }
          helperText="Text models from the allowlisted authors."
          value={draft.classifierModel}
          options={classifierOptions}
          disabled={busy || catalog.isPending}
          placeholder={catalog.isPending ? "Loading models…" : "Select a classifier model"}
          searchPlaceholder="Search models…"
          onValueChange={(classifierModel) => setField("classifierModel", classifierModel)}
        />
        <SettingsTextField
          label="Classifier max tokens"
          type="number"
          min={256}
          max={128_000}
          step={1}
          value={draft.classifierMaxTokens}
          dirty={intChanged(draft.classifierMaxTokens, data.classifierMaxTokens)}
          disabled={busy}
          onChange={(classifierMaxTokens) => setField("classifierMaxTokens", classifierMaxTokens)}
        />
        <SearchableSelect
          label={
            <DirtyFieldLabel
              label="Statement reader model"
              dirty={textChanged(draft.pdfParserModel, data.pdfParserModel)}
            />
          }
          helperText="Vision models (image input) from the allowlisted authors."
          value={draft.pdfParserModel}
          options={pdfParserOptions}
          disabled={busy || catalog.isPending}
          placeholder={catalog.isPending ? "Loading models…" : "Select a statement reader model"}
          searchPlaceholder="Search models…"
          onValueChange={(pdfParserModel) => setField("pdfParserModel", pdfParserModel)}
        />
        <SettingsTextField
          label="Statement reader max tokens"
          type="number"
          min={256}
          max={128_000}
          step={1}
          value={draft.pdfParserMaxTokens}
          dirty={intChanged(draft.pdfParserMaxTokens, data.pdfParserMaxTokens)}
          disabled={busy}
          onChange={(pdfParserMaxTokens) => setField("pdfParserMaxTokens", pdfParserMaxTokens)}
        />
      </SettingsSection>

      <SettingsSection
        title="Prompt temperatures"
        description="0 repeats the same answer. Higher values allow more variation (0–2)."
        className="space-y-6"
        contentClassName="grid gap-5 sm:grid-cols-2"
      >
        <SettingsTextField
          label="Taxability"
          helperText="Scores whether a row should be included in tax."
          type="number"
          min={0}
          max={2}
          step={0.1}
          value={draft.taxabilityTemperature}
          dirty={temperatureChanged(draft.taxabilityTemperature, taxabilitySaved)}
          disabled={busy}
          onChange={(taxabilityTemperature) => setField("taxabilityTemperature", taxabilityTemperature)}
        />
        <SettingsTextField
          label="Category"
          helperText="Assigns a purpose category when keywords are unsure."
          type="number"
          min={0}
          max={2}
          step={0.1}
          value={draft.categoryTemperature}
          dirty={temperatureChanged(draft.categoryTemperature, categorySaved)}
          disabled={busy}
          onChange={(categoryTemperature) => setField("categoryTemperature", categoryTemperature)}
        />
      </SettingsSection>

      <div className="flex items-center justify-end gap-3">
        {dirty ? (
          <p className="text-body-sm text-on-surface-variant">Unsaved changes</p>
        ) : null}
        <Button type="submit" size="sm" disabled={!dirty || busy}>
          Save
        </Button>
      </div>
    </form>
  );
}
