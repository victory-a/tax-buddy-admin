"use client";

import * as React from "react";

import {
  SettingsSection,
  SettingsTextField,
  SettingsToggleField,
} from "@/components/settings/settings-field";
import { Button } from "@/components/ui";
import {
  type AdminConfig,
  type AdminConfigPatch,
  useAdminConfig,
  useUpdateAdminConfig,
} from "@/lib/api/admin-config";
import { showToast } from "@/lib/toast";

type SubscriptionDraft = {
  subscriptionEnforcement: boolean;
  subscriptionFreeUses: string;
};

function draftFromConfig(config: AdminConfig): SubscriptionDraft {
  return {
    subscriptionEnforcement: config.subscriptionEnforcement,
    subscriptionFreeUses: String(config.subscriptionFreeUses),
  };
}

function intChanged(draft: string, saved: number): boolean {
  const next = Number(draft);
  return Number.isFinite(next) && Math.round(next) !== saved;
}

function buildPatch(saved: AdminConfig, draft: SubscriptionDraft): AdminConfigPatch | null {
  const patch: AdminConfigPatch = {};

  if (draft.subscriptionEnforcement !== saved.subscriptionEnforcement) {
    patch.subscriptionEnforcement = draft.subscriptionEnforcement;
  }
  if (intChanged(draft.subscriptionFreeUses, saved.subscriptionFreeUses)) {
    patch.subscriptionFreeUses = Math.round(Number(draft.subscriptionFreeUses));
  }

  return Object.keys(patch).length > 0 ? patch : null;
}

export function SettingsSubscriptionPanel() {
  const { data, isPending, isError } = useAdminConfig();
  const update = useUpdateAdminConfig();
  const [draft, setDraft] = React.useState<SubscriptionDraft | null>(null);

  React.useEffect(() => {
    if (data) setDraft(draftFromConfig(data));
  }, [data]);

  if (isPending || !draft) {
    return <div className="h-48 max-w-2xl animate-pulse rounded-2xl bg-surface-container" aria-hidden />;
  }

  if (isError || !data) {
    return <p className="text-body-md text-error">Settings unavailable. Refresh to try again.</p>;
  }

  const patch = buildPatch(data, draft);
  const dirty = patch != null;

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (!patch) return;
        update.mutate(patch, {
          onSuccess: () => {
            showToast({ value: "Subscription settings saved", variant: "success" });
          },
          onError: () => {
            showToast({ value: "Could not save settings", variant: "error" });
          },
        });
      }}
    >
      <SettingsSection
        title="Subscription"
        description="Free-tier limits and whether the gate is active. Saved values live in the database."
      >
        <SettingsToggleField
          label="Enforce free-use limit"
          description="When off, every signed-in user can classify without burning free uses."
          checked={draft.subscriptionEnforcement}
          dirty={draft.subscriptionEnforcement !== data.subscriptionEnforcement}
          disabled={update.isPending}
          onChange={(subscriptionEnforcement) =>
            setDraft((prev) => (prev ? { ...prev, subscriptionEnforcement } : prev))
          }
        />
        <SettingsTextField
          label="Free uses per account"
          helperText="How many classify actions a free user gets before upgrade."
          type="number"
          min={0}
          max={10_000}
          step={1}
          value={draft.subscriptionFreeUses}
          dirty={intChanged(draft.subscriptionFreeUses, data.subscriptionFreeUses)}
          disabled={update.isPending}
          onChange={(subscriptionFreeUses) =>
            setDraft((prev) => (prev ? { ...prev, subscriptionFreeUses } : prev))
          }
        />
      </SettingsSection>

      <div className="flex max-w-2xl items-center justify-end gap-3">
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
