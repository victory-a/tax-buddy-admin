"use client";

import { KeywordBank } from "@/components/rules/keyword-bank";
import { UnderlineTabPanel, UnderlineTabs } from "@/components/ui/underline-tabs";
import { useAdminPersonaKeywords } from "@/lib/api/admin-persona-keywords";
import {
  ADMIN_PERSONA_OPTIONS,
  adminPersonaOption,
  type AdminPersona,
} from "@/lib/persona-labels";
import { useUrlTab } from "@/lib/use-url-tab";

const PERSONA_TAB_IDS = ADMIN_PERSONA_OPTIONS.map((option) => option.id);

export function RulesView() {
  const { activeTab: persona, setActiveTab: setPersona } = useUrlTab<AdminPersona>(
    PERSONA_TAB_IDS,
    "freelanceGig",
  );
  const { data, isPending, isError, error, refetch } = useAdminPersonaKeywords(persona);
  const option = adminPersonaOption(persona);
  const Icon = option.Icon;

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 w-full">
      <header className="flex flex-col gap-2 max-w-2xl">
        <h1 className="font-display text-headline-lg tracking-tight text-on-surface">Rules</h1>
        <p className="text-body-md text-on-surface-variant">
          Global keyword banks for each income persona. Classification uses these before personal
          overrides.
        </p>
      </header>

      <UnderlineTabs
        items={ADMIN_PERSONA_OPTIONS.map((item) => ({
          id: item.id,
          label: item.label,
        }))}
        active={persona}
        onChange={setPersona}
        ariaLabel="Income personas"
        idPrefix="rules"
      />

      <UnderlineTabPanel idPrefix="rules" tab={persona} active={persona}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <span
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-container text-on-surface-variant"
                aria-hidden
              >
                <Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-headline-sm text-on-surface">{option.title}</h2>
                <p className="mt-1 max-w-xl text-body-sm text-on-surface-variant">
                  {option.description}
                </p>
              </div>
            </div>
            {data && data.taxProfileCount > 0 ? (
              <p className="shrink-0 text-body-sm text-on-surface-variant">
                Used on{" "}
                <span className="font-tabular text-on-surface">{data.taxProfileCount}</span>{" "}
                profile{data.taxProfileCount === 1 ? "" : "s"}
              </p>
            ) : null}
          </div>

          {isPending ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-56 animate-pulse rounded-2xl bg-surface-container-high" />
              <div className="h-56 animate-pulse rounded-2xl bg-surface-container-high" />
            </div>
          ) : isError || !data ? (
            <p className="text-body-sm text-error">
              {error instanceof Error ? error.message : "Could not load keywords."}{" "}
              <button
                type="button"
                className="underline cursor-pointer"
                onClick={() => void refetch()}
              >
                Retry
              </button>
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 md:gap-0 md:divide-x md:divide-outline-variant/50">
              <div className="md:pr-8 min-w-0">
                <KeywordBank
                  persona={persona}
                  kind="include"
                  title="Include"
                  description="Suggests taxable inflows for this persona."
                  items={data.items}
                  taxProfileCount={data.taxProfileCount}
                />
              </div>
              <div className="md:pl-8 min-w-0">
                <KeywordBank
                  persona={persona}
                  kind="exclude"
                  title="Exclude"
                  description="Personal transfers, fees, or non-income credits."
                  items={data.items}
                  taxProfileCount={data.taxProfileCount}
                />
              </div>
            </div>
          )}
        </div>
      </UnderlineTabPanel>
    </main>
  );
}
