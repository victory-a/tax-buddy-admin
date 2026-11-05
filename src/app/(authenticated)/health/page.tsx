import { redirect } from "next/navigation";

/** Health signals live on Overview now. */
export default function HealthPage() {
  redirect("/overview");
}
