"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Loader2, RefreshCw } from "lucide-react";

import { OverviewPie } from "@/components/overview/overview-pie";
import { OverviewSignals } from "@/components/overview/overview-signals";
import { Button } from "@/components/ui";
import { useAdminOverview } from "@/lib/api/admin-overview";
import { cn } from "@/lib/utils";

function Stat({
  label,
  value,
  warn,
}: {
  label: string;
  value: number | string;
  warn?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-body-sm text-on-surface-variant">{label}</dt>
      <dd
        className={cn(
          "mt-0.5 font-tabular text-body-md text-on-surface",
          warn && "text-error",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function Panel({
  title,
  description,
  href,
  hrefLabel,
  children,
}: {
  title: string;
  description: string;
  href: string;
  hrefLabel: string;
  children: ReactNode;
}) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-outline-variant/60 bg-surface-container-low p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-headline-sm text-on-surface">{title}</h2>
          <p className="mt-1 text-body-md text-on-surface-variant">{description}</p>
        </div>
        <Link
          href={href}
          className="shrink-0 text-body-sm font-medium text-on-surface-variant underline-offset-2 hover:text-on-surface hover:underline"
        >
          {hrefLabel}
        </Link>
      </div>
      <div className="mt-6 flex flex-1 flex-col">{children}</div>
    </section>
  );
}

export function OverviewView() {
  const { data, isPending, isError, error, refetch, isFetching } = useAdminOverview();

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 max-w-5xl">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="font-display text-headline-lg tracking-tight text-on-surface">Overview</h1>
          <p className="text-body-md text-on-surface-variant">
            Health, queue pressure, and account mix. Refreshes every 30s.
          </p>
        </div>
        <Button
          type="button"
          variant="outlined"
          className="shrink-0"
          iconLeft={isFetching ? <Loader2 className="animate-spin" /> : <RefreshCw />}
          disabled={isFetching}
          onClick={() => void refetch()}
        >
          Refresh
        </Button>
      </header>

      {isPending ? (
        <div className="space-y-4" aria-hidden>
          <div className="h-40 animate-pulse rounded-2xl bg-surface-container" />
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-64 animate-pulse rounded-2xl bg-surface-container" />
            <div className="h-64 animate-pulse rounded-2xl bg-surface-container" />
          </div>
        </div>
      ) : null}

      {isError || !data ? (
        <p className="text-body-md text-error">
          {error instanceof Error ? error.message : "Could not load overview."}
        </p>
      ) : (
        <div className="space-y-4">
          <OverviewSignals data={data} />

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel
              title="Queues"
              description="Open and failed work across ingestion and classification."
              href="/queues"
              hrefLabel="Open queues"
            >
              <dl className="grid gap-4 sm:grid-cols-2">
                <Stat label="Ingest processing" value={data.queues.ingestionProcessing} />
                <Stat
                  label="Ingest failed"
                  value={data.queues.ingestionFailed}
                  warn={data.queues.ingestionFailed > 0}
                />
                <Stat
                  label="Classify active"
                  value={
                    data.queues.classificationQueued + data.queues.classificationProcessing
                  }
                />
                <Stat
                  label="Classify failed"
                  value={data.queues.classificationFailed}
                  warn={data.queues.classificationFailed > 0}
                />
                <Stat
                  label="Batches open"
                  value={data.queues.batchesQueued + data.queues.batchesLeased}
                />
                <Stat
                  label="Batches failed"
                  value={data.queues.batchesFailed}
                  warn={data.queues.batchesFailed > 0}
                />
              </dl>
            </Panel>

            <Panel
              title="Accounts"
              description="Paid vs free mix, plus the last 24 hours."
              href="/users"
              hrefLabel="Open users"
            >
              <OverviewPie
                ariaLabel="Account mix"
                slices={[
                  {
                    label: "Paid",
                    value: data.metrics24h.paidUsers,
                    className: "fill-primary bg-primary",
                  },
                  {
                    label: "Free",
                    value: Math.max(
                      0,
                      data.metrics24h.freeUsers - data.metrics24h.freeExhausted,
                    ),
                    className: "fill-secondary bg-secondary",
                  },
                  {
                    label: "Free exhausted",
                    value: data.metrics24h.freeExhausted,
                    className: "fill-error bg-error",
                  },
                ]}
              />
              <dl className="mt-6 grid gap-4 border-t border-outline-variant/50 pt-6 sm:grid-cols-2">
                <Stat label="Signups (24h)" value={data.metrics24h.signups} />
                <Stat
                  label="Failed uploads (24h)"
                  value={data.metrics24h.failedUploads}
                  warn={data.metrics24h.failedUploads > 0}
                />
                <Stat
                  label={`Free limit`}
                  value={`${data.metrics24h.freeUsesLimit} uses`}
                />
                <Stat label="PDF reader" value={data.models.pdfParserState} />
              </dl>
            </Panel>
          </div>
        </div>
      )}
    </main>
  );
}
