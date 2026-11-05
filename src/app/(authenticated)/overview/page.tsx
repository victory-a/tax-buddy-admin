import { PlaceholderPage } from "@/components/shell/placeholder-page";

export default function OverviewPage() {
  return (
    <PlaceholderPage
      title="Overview"
      summary="Is the product healthy right now, and are the queues moving."
      bullets={[
        "DB reachability (`GET /api/health-check/ready`)",
        "OpenRouter key + classifier / statement-reader catalog status",
        "Classifier generation probe (separate from catalog check)",
        "Ingestion + classification queue depth (queued / processing / failed)",
        "Signups, paid vs free, free-tier exhausted, failed uploads (24h)",
      ]}
    />
  );
}
