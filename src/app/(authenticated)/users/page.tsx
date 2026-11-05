import { PlaceholderPage } from "@/components/shell/placeholder-page";

export default function UsersPage() {
  return (
    <PlaceholderPage
      title="Users & billing"
      summary="Account search, subscription overrides, and support entry. Billing is account-level on User."
      bullets={[
        "Search by email or name",
        "Card: created, Google id, profiles, session (revoke)",
        "Subscription: isPaid, paidUntil, freeUsesUsed / limit",
        "Actions: grant (incl. open-ended), revoke, set end date, reset free uses",
        "Usage: classification jobs, last status, currently 402-blocked",
        "Drill into support case: imports, classify jobs, tax snapshots, personal keywords",
        "Webhook event log + tester once payment provider is wired",
      ]}
    />
  );
}
