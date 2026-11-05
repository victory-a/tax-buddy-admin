"use client";

import { Button } from "@/components/ui";
import { TablePagination } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function StatusPills<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn(
            "rounded-lg px-2.5 py-1.5 text-body-sm cursor-pointer transition-colors",
            value === option.value
              ? "bg-primary text-on-primary"
              : "bg-surface-container text-on-surface-variant hover:text-on-surface",
          )}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function QueuePager({
  page,
  pageSize,
  total,
  fetching,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  fetching: boolean;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      {fetching ? <p className="text-body-sm text-on-surface-variant">Refreshing…</p> : null}
      <TablePagination page={page} pageSize={pageSize} total={total} onPageChange={onPageChange} />
    </div>
  );
}

export function ErrorBlock({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-error/30 bg-error-container/40 px-4 py-5">
      <p className="text-body-md text-on-error-container">{message}</p>
      <Button type="button" variant="outlined" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
