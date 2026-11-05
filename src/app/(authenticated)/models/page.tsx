import { PlaceholderPage } from "@/components/shell/placeholder-page";

export default function ModelsPage() {
  return (
    <PlaceholderPage
      title="Models"
      summary="OpenRouter classifier + PDF statement reader. APIs exist; gate them to admin."
      bullets={[
        "Configured model ids, max tokens, catalog listing, last probe",
        "Prompt temperatures (Setting table via GET/PATCH /api/models/prompts)",
        "LLM skipped indicator when OPENROUTER_API_KEY is empty",
        "v1: model id stays env + redeploy; live PUT only after probe + audit",
      ]}
    />
  );
}
