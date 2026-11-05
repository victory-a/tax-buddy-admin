import type { ModelConnectionState } from "@/lib/api/models";

export const STATE_LABEL: Record<ModelConnectionState, string> = {
  connected: "Connected",
  not_configured: "Not configured",
  unauthorized: "Rejected",
  unreachable: "Unreachable",
  unknown_model: "Not listed",
};

export const STATE_CLASS: Record<ModelConnectionState, string> = {
  connected: "bg-secondary-container text-on-secondary-container",
  not_configured: "bg-surface-container-high text-on-surface-variant",
  unauthorized: "bg-error-container text-on-error-container",
  unreachable: "bg-error-container text-on-error-container",
  unknown_model: "bg-error-container text-on-error-container",
};

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function formatCheckedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export function formatLatency(ms: number | null): string {
  if (ms == null) return "Not measured";
  return `${ms.toLocaleString()} ms`;
}

export function formatUsd(value: number | null): string {
  if (value == null) return "Not reported";
  return usd.format(value);
}

export function formatModalities(modalities: string[]): string {
  if (modalities.length === 0) return "Not reported";
  return modalities.join(", ");
}

export function formatPlan(isFreeTier: boolean | null): string {
  if (isFreeTier == null) return "Not reported";
  return isFreeTier ? "Free tier" : "Paid";
}
