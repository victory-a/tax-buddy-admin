export function PlaceholderPage({
  title,
  summary,
  bullets,
}: {
  title: string;
  summary: string;
  bullets: readonly string[];
}) {
  return (
    <main className="flex flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2 max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
          Planned
        </p>
        <h1 className="font-display text-headline-lg tracking-tight text-on-surface">{title}</h1>
        <p className="text-body-md text-on-surface-variant">{summary}</p>
      </header>

      <ul className="max-w-2xl list-disc space-y-2 pl-5 text-body-md text-on-surface">
        {bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </main>
  );
}
