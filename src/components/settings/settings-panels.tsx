"use client";

import {
  SettingsSection,
  SettingsTextField,
  SettingsToggleField,
} from "@/components/settings/settings-field";
import type { AdminConfig, AdminConfigPatch } from "@/lib/api/admin-config";

type PanelProps = {
  config: AdminConfig;
  save: (patch: AdminConfigPatch) => void;
  saving: boolean;
};

export function SettingsSubscriptionPanel({ config, save, saving }: PanelProps) {
  return (
    <SettingsSection
      title="Subscription"
      description="Free-tier limits and whether the gate is active. Env defaults apply until you save here."
    >
      <SettingsToggleField
        label="Enforce free-use limit"
        description="When off, every signed-in user can classify without burning free uses."
        checked={config.subscriptionEnforcement}
        disabled={saving}
        onChange={(subscriptionEnforcement) => save({ subscriptionEnforcement })}
      />
      <SettingsTextField
        label="Free uses per account"
        helperText="How many classify actions a free user gets before upgrade."
        type="number"
        min={0}
        max={10_000}
        step={1}
        value={config.subscriptionFreeUses}
        onCommit={(raw) => {
          const next = Number(raw);
          if (!Number.isFinite(next) || next === config.subscriptionFreeUses) return;
          save({ subscriptionFreeUses: Math.round(next) });
        }}
      />
    </SettingsSection>
  );
}
