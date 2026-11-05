"use client";

import { Loader2, RefreshCw } from "lucide-react";

import { ModelsConfigPanel } from "@/components/models/models-config-panel";
import { ModelsStatusPanel } from "@/components/models/models-status-panel";
import { Button } from "@/components/ui";
import { UnderlineTabPanel, UnderlineTabs } from "@/components/ui/underline-tabs";
import { useModelStatus } from "@/lib/api/models";
import { useUrlTab } from "@/lib/use-url-tab";

const MODELS_TABS = [
  { id: "status", label: "Status" },
  { id: "configure", label: "Configure" },
] as const;

type ModelsTab = (typeof MODELS_TABS)[number]["id"];

const MODELS_TAB_IDS = MODELS_TABS.map((tab) => tab.id);

export function ModelsView() {
  const { activeTab, setActiveTab } = useUrlTab<ModelsTab>(MODELS_TAB_IDS, "status");
  const { isFetching, refetch } = useModelStatus();

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 max-w-5xl">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="font-display text-headline-lg tracking-tight text-on-surface">Models</h1>
          <p className="text-body-md text-on-surface-variant">
            Probe OpenRouter and edit classifier / statement-reader model ids. Does not run a
            generation. Empty API key shows skipped / not configured — not healthy green.
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

      <UnderlineTabs
        items={MODELS_TABS}
        active={activeTab}
        onChange={setActiveTab}
        ariaLabel="Models sections"
        idPrefix="models"
      />

      <UnderlineTabPanel idPrefix="models" tab="status" active={activeTab}>
        <ModelsStatusPanel />
      </UnderlineTabPanel>
      <UnderlineTabPanel idPrefix="models" tab="configure" active={activeTab}>
        <ModelsConfigPanel />
      </UnderlineTabPanel>
    </main>
  );
}
