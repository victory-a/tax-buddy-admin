"use client";

import { BatchesPanel } from "@/components/queues/batches-panel";
import { ClassificationJobsPanel } from "@/components/queues/classification-jobs-panel";
import { IngestionPanel } from "@/components/queues/ingestion-panel";
import { UnderlineTabPanel, UnderlineTabs } from "@/components/ui/underline-tabs";
import { useUrlTab } from "@/lib/use-url-tab";

const QUEUE_TABS = [
  { id: "ingestion", label: "Ingestion" },
  { id: "jobs", label: "Classify jobs" },
  { id: "batches", label: "Batches" },
] as const;

type QueueTab = (typeof QUEUE_TABS)[number]["id"];

const QUEUE_TAB_IDS = QUEUE_TABS.map((tab) => tab.id);

export function QueuesView() {
  const { activeTab, setActiveTab } = useUrlTab<QueueTab>(QUEUE_TAB_IDS, "ingestion");

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2 max-w-3xl">
        <h1 className="font-display text-headline-lg tracking-tight text-on-surface">Queues</h1>
        <p className="text-body-md text-on-surface-variant">
          Stuck imports and classification work across all users. Cancel a wedged classify job to
          unblock that account.
        </p>
      </header>

      <UnderlineTabs
        items={QUEUE_TABS}
        active={activeTab}
        onChange={setActiveTab}
        ariaLabel="Queue sections"
        idPrefix="queues"
      />

      <UnderlineTabPanel idPrefix="queues" tab="ingestion" active={activeTab}>
        <IngestionPanel />
      </UnderlineTabPanel>
      <UnderlineTabPanel idPrefix="queues" tab="jobs" active={activeTab}>
        <ClassificationJobsPanel />
      </UnderlineTabPanel>
      <UnderlineTabPanel idPrefix="queues" tab="batches" active={activeTab}>
        <BatchesPanel />
      </UnderlineTabPanel>
    </main>
  );
}
