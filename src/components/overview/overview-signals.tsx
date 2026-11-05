import type { AdminOverview } from "@/lib/api/admin-overview";
import { cn } from "@/lib/utils";

function SignalRow({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "size-2.5 shrink-0 rounded-full",
            ok ? "bg-secondary" : "bg-error",
          )}
          aria-hidden
        />
        <p className="text-body-md font-medium text-on-surface">
          {label}
          <span className="sr-only">{ok ? " OK" : " Fail"}</span>
        </p>
      </div>
      <p className="truncate text-body-sm text-on-surface-variant" title={detail}>
        {detail}
      </p>
    </div>
  );
}

export function OverviewSignals({ data }: { data: AdminOverview }) {
  const dbOk = data.database.reachable;
  const providerOk = data.models.providerState === "connected";
  const classifierOk = data.models.classifierState === "connected";
  const dbDetail = dbOk
    ? `Reachable${data.database.latencyMs != null ? ` · ${data.database.latencyMs} ms` : ""}`
    : data.database.lastError || "Database unreachable";

  return (
    <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-low p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-headline-sm text-on-surface">System health</h2>
          <p className="mt-1 text-body-md text-on-surface-variant">
            API, database, and model catalog signals from the last overview refresh.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <SignalRow label="API" ok detail="Overview reachable" />
        <SignalRow label="Database" ok={dbOk} detail={dbDetail} />
        <SignalRow label="OpenRouter" ok={providerOk} detail={data.models.providerMessage} />
        <SignalRow label="Classifier" ok={classifierOk} detail={data.models.classifierMessage} />
      </div>
    </section>
  );
}
