import type { ReactNode } from "react";

export function UserPanel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-outline-variant/60 bg-surface-container-low p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-headline-sm text-on-surface">{title}</h2>
          {description ? (
            <p className="mt-1 text-body-md text-on-surface-variant">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="mt-6 flex flex-1 flex-col gap-4">{children}</div>
    </section>
  );
}

export function UserDetail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-body-sm text-on-surface-variant">{label}</dt>
      <dd className="mt-0.5 break-all text-body-md text-on-surface">{value}</dd>
    </div>
  );
}
