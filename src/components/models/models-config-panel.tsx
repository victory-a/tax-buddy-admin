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
import { showToast } from "@/lib/toast";

type ModelsDraft = {
  classifierModel: string;
  classifierMaxTokens: string;
  pdfParserModel: string;
  pdfParserMaxTokens: string;
};

function draftFromConfig(config: AdminConfig): ModelsDraft {
  return {
    classifierModel: config.classifierModel,
    classifierMaxTokens: String(config.classifierMaxTokens),
    pdfParserModel: config.pdfParserModel,
    pdfParserMaxTokens: String(config.pdfParserMaxTokens),
  };
}

function textChanged(draft: string, saved: string): boolean {
  return draft.trim() !== saved;
}

function intChanged(draft: string, saved: number): boolean {
  const next = Number(draft);
  return Number.isFinite(next) && Math.round(next) !== saved;
}

function buildPatch(saved: AdminConfig, draft: ModelsDraft): AdminConfigPatch | null {
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
  const catalog = useOpenRouterCatalog();
  const update = useUpdateAdminConfig();
  const [draft, setDraft] = React.useState<ModelsDraft | null>(null);

  React.useEffect(() => {
    if (data) setDraft(draftFromConfig(data));
  }, [data]);

  function setField<K extends keyof ModelsDraft>(key: K, value: ModelsDraft[K]) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  if (isPending || !draft) {
    return <div className="h-48 animate-pulse rounded-2xl bg-surface-container" aria-hidden />;
  }

  if (isError || !data) {
    return <p className="text-body-md text-error">Settings unavailable. Refresh to try again.</p>;
  }

  const patch = buildPatch(data, draft);
  const dirty = patch != null;
  const classifierOptions = toOptions(catalog.data?.classifier, draft.classifierModel);
  const pdfParserOptions = toOptions(catalog.data?.pdfParser, draft.pdfParserModel);
  const catalogHint = catalog.data?.ok
    ? `google · openai · anthropic · qwen · nvidia (${catalog.data.classifier.length} text / ${catalog.data.pdfParser.length} vision)`
    : catalog.data?.message ??
      (catalog.isPending ? "Loading OpenRouter catalog…" : "Catalog unavailable.");

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (!patch) return;
        update.mutate(patch, {
          onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["admin", "models"] });
            showToast({ value: "Model settings saved", variant: "success" });
          },
          onError: () => {
            showToast({ value: "Could not save settings", variant: "error" });
          },
        });
      }}
    >
      <SettingsSection
        title="Configure"
        description={`OpenRouter model ids and completion budgets. ${catalogHint}`}
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
          disabled={update.isPending || catalog.isPending}
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
          disabled={update.isPending}
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
          disabled={update.isPending || catalog.isPending}
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
          disabled={update.isPending}
          onChange={(pdfParserMaxTokens) => setField("pdfParserMaxTokens", pdfParserMaxTokens)}
        />
      </SettingsSection>

      <div className="flex items-center justify-end gap-3">
        {dirty ? (
          <p className="text-body-sm text-on-surface-variant">Unsaved changes</p>
        ) : null}
        <Button type="submit" size="sm" disabled={!dirty || update.isPending}>
          Save
        </Button>
      </div>
    </form>
  );
}
