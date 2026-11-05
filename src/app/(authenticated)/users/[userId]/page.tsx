import { PlaceholderPage } from "@/components/shell/placeholder-page";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function UserDetailPage({ params }: Props) {
  const { userId } = await params;

  return (
    <PlaceholderPage
      title="Support case"
      summary={`User ${userId}. Counts and statuses first; raw bank rows only when debugging.`}
      bullets={[
        "Imports: file, customerName, persona, status, error, staged vs confirmed counts",
        "Retry / fail stuck ingestion jobs",
        "Classification: status, scope, importJobId, batches, lease, cancel / release",
        "Tax: deductions for a year + TaxComputation snapshots (read-only)",
        "Personal keywords (rare edits, audited)",
        "Do not edit ledger include/exclude or recompute tax from admin",
      ]}
    />
  );
}
