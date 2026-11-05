import { ModelPromptTemperatures } from "@/components/models/prompt-temperatures";
import {
  formatLatency,
  formatModalities,
  STATE_CLASS,
  STATE_LABEL,
} from "@/components/models/model-status-format";
import type { AiModelStatus, ModelConnectionState } from "@/lib/api/models";
import { cn } from "@/lib/utils";

function StatusPill({ state }: { state: ModelConnectionState }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-body-sm font-medium",
        STATE_CLASS[state],
      )}
    >
      {STATE_LABEL[state]}
    </span>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-body-sm text-on-surface-variant">{label}</dt>
      <dd className="mt-0.5 break-all text-body-md text-on-surface">{value}</dd>
    </div>
  );
}

export function ModelCard({ model }: { model: AiModelStatus }) {
  const modelId = model.model === "" ? "Not set" : model.model;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-outline-variant/60 bg-surface-container-low p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-headline-sm text-on-surface">{model.label}</h2>
        <StatusPill state={model.state} />
      </div>
      <p className="mt-2 text-body-md text-on-surface-variant">{model.purpose}</p>
      <p className="mt-4 text-body-md text-on-surface">{model.message}</p>
      {model.warning ? (
        <p className="mt-2 rounded-xl bg-surface-container px-3 py-2 text-body-sm text-on-surface">
          {model.warning}
        </p>
      ) : null}
      <dl className="mt-6 grid flex-1 gap-4 sm:grid-cols-2">
        <Detail label="Model" value={model.catalogName ?? modelId} />
        <Detail label="Model id" value={modelId} />
        <Detail label="Max tokens" value={model.maxTokens.toLocaleString()} />
        <Detail label="Catalog check" value={formatLatency(model.latencyMs)} />
        <Detail
          label="Context"
          value={model.contextLength == null ? "Not reported" : model.contextLength.toLocaleString()}
        />
        <Detail label="Inputs" value={formatModalities(model.inputModalities)} />
      </dl>
      {model.id === "classifier" ? <ModelPromptTemperatures ids={["taxability", "category"]} /> : null}
    </article>
  );
}
