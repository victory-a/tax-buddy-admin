import { PlaceholderPage } from "@/components/shell/placeholder-page";

export default function QueuesPage() {
  return (
    <PlaceholderPage
      title="Queues"
      summary="Cross-user view of ingestion and classification work."
      bullets={[
        "Ingestion: processing / failed, error, age",
        "Classification jobs: status, requester, scope, wait since lastClaimedAt",
        "Batches: queued / leased / failed, attempt, leaseExpiresAt, lastError",
        "Actions: release lease, requeue failed batch, cancel stuck job",
        "No bulk delete of user data",
      ]}
    />
  );
}
