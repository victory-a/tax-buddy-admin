import { PlaceholderPage } from "@/components/shell/placeholder-page";

export default function HealthPage() {
  return (
    <PlaceholderPage
      title="Health"
      summary="Focused probes. Overview shows the same signals at a glance."
      bullets={[
        "GET /api/health-check + /ready",
        "Classifier status + generation probe",
        "Model catalog status",
      ]}
    />
  );
}
