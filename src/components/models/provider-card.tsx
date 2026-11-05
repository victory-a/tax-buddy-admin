import {
  formatCheckedAt,
  formatLatency,
  formatPlan,
  formatUsd,
  STATE_CLASS,
  STATE_LABEL,
} from "@/components/models/model-status-format";
import type { AiProviderStatus, ProviderConnectionState } from "@/lib/api/models";
import { cn } from "@/lib/utils";

function StatusPill({ state }: { state: ProviderConnectionState }) {
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

export function ProviderCard({
  provider,
  checkedAt,
}: {
  provider: AiProviderStatus;
  checkedAt: string;
}) {
  return (
    <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-low p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-headline-sm text-on-surface">{provider.name}</h2>
          <p className="mt-1 text-body-md text-on-surface-variant">{provider.message}</p>
        </div>
        <StatusPill state={provider.state} />
      </div>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Detail label="Endpoint" value={provider.baseUrl} />
        <Detail label="Key check" value={formatLatency(provider.latencyMs)} />
        <Detail label="Checked" value={formatCheckedAt(checkedAt)} />
        <Detail label="Plan" value={formatPlan(provider.isFreeTier)} />
        <Detail label="Usage" value={formatUsd(provider.usage)} />
        <Detail label="Remaining" value={formatUsd(provider.limitRemaining)} />
      </dl>
    </section>
  );
}
