"use client";

import { SettingsSubscriptionPanel } from "@/components/settings/settings-panels";
import { UnderlineTabPanel, UnderlineTabs } from "@/components/ui/underline-tabs";
import { useUrlTab } from "@/lib/use-url-tab";

const SETTINGS_TABS = [{ id: "subscription", label: "Subscription" }] as const;

type SettingsTab = (typeof SETTINGS_TABS)[number]["id"];

const SETTINGS_TAB_IDS = SETTINGS_TABS.map((tab) => tab.id);

export function SettingsView() {
  const { activeTab, setActiveTab } = useUrlTab<SettingsTab>(SETTINGS_TAB_IDS, "subscription");

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2 max-w-3xl">
        <h1 className="font-display text-headline-lg tracking-tight text-on-surface">Settings</h1>
        <p className="text-body-md text-on-surface-variant">
          Subscription limits and gates. Model ids live on Models → Configure. Secrets stay in
          server env.
        </p>
      </header>

      <UnderlineTabs
        items={SETTINGS_TABS}
        active={activeTab}
        onChange={setActiveTab}
        ariaLabel="Settings sections"
        idPrefix="settings"
      />

      <UnderlineTabPanel idPrefix="settings" tab="subscription" active={activeTab}>
        <SettingsSubscriptionPanel />
      </UnderlineTabPanel>
    </main>
  );
}
