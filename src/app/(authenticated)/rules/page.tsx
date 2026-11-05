import { PlaceholderPage } from "@/components/shell/placeholder-page";

export default function RulesPage() {
  return (
    <PlaceholderPage
      title="Rules"
      summary="Global classification behavior. Persona keywords move here from the user Rules page."
      bullets={[
        "PersonaKeyword CRUD per income profile (include/exclude, weight)",
        "Show usage before delete",
        "Category catalog: view-only (code in categoryCatalog.ts)",
        "Rule packs: view-only until packs become data (id, year, default, bands/reliefs)",
      ]}
    />
  );
}
