"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Primitive table elements                                           */
/* ------------------------------------------------------------------ */

type TableAppearance = "default" | "plain";

const TableAppearanceContext = React.createContext<TableAppearance>("default");

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { appearance?: TableAppearance }
>(({ className, appearance = "default", ...props }, ref) => (
  <TableAppearanceContext.Provider value={appearance}>
    <div
      className={cn(
        "relative w-full overflow-auto rounded-2xl bg-surface-container-lowest",
        appearance === "plain" ? "border border-outline-variant/35" : "border border-outline-variant",
      )}
    >
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom text-data-tabular text-on-surface",
          className,
        )}
        {...props}
      />
    </div>
  </TableAppearanceContext.Provider>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const appearance = React.useContext(TableAppearanceContext);
  return (
  <thead
    ref={ref}
    className={cn(
      "sticky top-0 z-10",
      appearance === "plain"
        ? "bg-surface-container-lowest [&_tr]:border-b [&_tr]:border-outline-variant/40"
        : "bg-surface-container-low [&_tr]:border-b [&_tr]:border-outline-variant",
      className,
    )}
    {...props}
  />
  );
});
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-outline-variant bg-surface-container-low",
      "font-medium text-on-surface",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { striped?: boolean }
>(({ className, striped, ...props }, ref) => {
  const appearance = React.useContext(TableAppearanceContext);
  return (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors",
      appearance === "plain" ? "border-outline-variant/35" : "border-outline-variant",
      "hover:bg-surface-container-low/70",
      "data-[state=selected]:bg-surface-container",
      striped && appearance !== "plain" && "even:bg-surface-container-low/40",
      className,
    )}
    {...props}
  />
  );
});
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & {
    /** Align numerically — right aligns content. */
    numeric?: boolean;
  }
>(({ className, numeric, ...props }, ref) => {
  const appearance = React.useContext(TableAppearanceContext);
  return (
  <th
    ref={ref}
    scope="col"
    className={cn(
      "text-left align-middle whitespace-nowrap text-on-surface-variant",
      appearance === "plain"
        ? "h-11 px-4 text-[11px] font-semibold uppercase tracking-[0.08em]"
        : "h-10 px-4 text-label-md uppercase",
      numeric && "text-right",
      className,
    )}
    {...props}
  />
  );
});
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }
>(({ className, numeric, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-4 py-4 align-middle",
      "text-data-tabular text-on-surface",
      numeric && "text-right tabular-nums",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("my-4 text-body-sm text-on-surface-variant", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

/* ------------------------------------------------------------------ */
/*  Pagination                                                         */
/* ------------------------------------------------------------------ */

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface TablePaginationProps {
  /** Current 1-based page index. */
  page: number;
  /** Items per page. */
  pageSize: number;
  /** Total item count across all pages. */
  total: number;
  /** Called with the new 1-based page index. */
  onPageChange: (page: number) => void;
  /** Called when page size changes. */
  onPageSizeChange?: (size: number) => void;
  /** Available page-size choices. Default: [10, 25, 50, 100]. */
  pageSizeOptions?: number[];
  className?: string;
}

const TablePagination = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
}: TablePaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(total, safePage * pageSize);

  const goTo = (p: number) =>
    onPageChange(Math.min(Math.max(1, p), totalPages));

  // Build a compact pager: 1 … (p-1) p (p+1) … N
  const pages: Array<number | "ellipsis"> = React.useMemo(() => {
    const out: Array<number | "ellipsis"> = [];
    const push = (v: number | "ellipsis") => out.push(v);
    const window = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= safePage - window && i <= safePage + window)
      ) {
        push(i);
      } else if (out[out.length - 1] !== "ellipsis") {
        push("ellipsis");
      }
    }
    return out;
  }, [safePage, totalPages]);

  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-3 px-1 py-3",
        "sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-center gap-3 text-body-sm text-on-surface-variant">
        <span>
          Showing <span className="text-on-surface font-medium">{start}</span>–
          <span className="text-on-surface font-medium">{end}</span> of{" "}
          <span className="text-on-surface font-medium">{total}</span>
        </span>
        {onPageSizeChange ? (
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => onPageSizeChange(Number(v))}
            >
              <SelectTrigger size="sm" className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>

      <nav
        role="navigation"
        aria-label="Table pagination"
        className="flex items-center gap-1"
      >
        <PagerButton
          aria-label="Previous page"
          disabled={safePage === 1}
          onClick={() => goTo(safePage - 1)}
        >
          <ChevronLeft className="size-4" />
        </PagerButton>
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span
              key={`e-${i}`}
              className="px-2 text-body-sm text-on-surface-variant"
            >
              …
            </span>
          ) : (
            <PagerButton
              key={p}
              aria-label={`Go to page ${p}`}
              aria-current={p === safePage ? "page" : undefined}
              active={p === safePage}
              onClick={() => goTo(p)}
            >
              {p}
            </PagerButton>
          ),
        )}
        <PagerButton
          aria-label="Next page"
          disabled={safePage === totalPages}
          onClick={() => goTo(safePage + 1)}
        >
          <ChevronRight className="size-4" />
        </PagerButton>
      </nav>
    </div>
  );
};
TablePagination.displayName = "TablePagination";

const PagerButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }
>(({ className, active, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "inline-flex h-8 min-w-8 items-center justify-center rounded-2xl px-2 cursor-pointer",
      "text-body-sm text-on-surface",
      "border border-transparent",
      "hover:bg-surface-container-low",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container/30",
      "disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed",
      active &&
        "bg-primary text-on-primary hover:bg-primary-container border-transparent",
      className,
    )}
    {...props}
  />
));
PagerButton.displayName = "PagerButton";

/* ------------------------------------------------------------------ */
/*  DataTable — fully composed table + pagination                      */
/* ------------------------------------------------------------------ */

export interface DataTableColumn<T> {
  /** Unique column id, used as React key. */
  id: string;
  /** Header label. */
  header: React.ReactNode;
  /** Cell renderer. */
  cell: (row: T, rowIndex: number) => React.ReactNode;
  /** Right-align numeric columns. */
  numeric?: boolean;
  /** Optional className applied to th and td. */
  className?: string;
  /** Header className override. */
  headerClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  /** Optional row key extractor. */
  getRowId?: (row: T, index: number) => string;
  /** Empty-state node when there are no rows. */
  emptyState?: React.ReactNode;
  /** Optional caption rendered below the table. */
  caption?: React.ReactNode;
  /** Enable zebra striping. */
  striped?: boolean;
  /** `plain` is the quieter ledger table: hairline rows, no zebra fill. */
  appearance?: "default" | "plain";
  /** Initial page (1-based). Default: 1. */
  initialPage?: number;
  /** Initial page size. Default: 10. */
  initialPageSize?: number;
  /** Page size selector options. */
  pageSizeOptions?: number[];
  /** Disable pagination entirely (renders all rows). */
  disablePagination?: boolean;
  /**
   * When true (default), `data` is the current server page — pass `page`, `pageSize`,
   * `total`, and change handlers. Set to false for client-side slicing of full `data`.
   */
  serverPagination?: boolean;
  /** Current 1-based page (server mode). */
  page?: number;
  /** Rows per page (server mode). */
  pageSize?: number;
  /** Total row count across all pages (server mode). */
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  /** Called when a row is clicked or activated via keyboard. */
  onRowClick?: (row: T, index: number) => void;
  /** Optional per-row className (e.g. dim out-of-period rows). */
  getRowClassName?: (row: T, index: number) => string | undefined;
  /** Accessible name for clickable rows. */
  getRowAriaLabel?: (row: T, index: number) => string;
  className?: string;
}

function DataTable<T>({
  data,
  columns,
  getRowId,
  emptyState,
  caption,
  striped = false,
  appearance = "default",
  initialPage = 1,
  initialPageSize = 10,
  pageSizeOptions,
  disablePagination = false,
  serverPagination = true,
  page: serverPage,
  pageSize: serverPageSize,
  total: serverTotal,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  getRowClassName,
  getRowAriaLabel,
  className,
}: DataTableProps<T>) {
  const [clientPage, setClientPage] = React.useState(initialPage);
  const [clientPageSize, setClientPageSize] = React.useState(initialPageSize);

  const isServerPaginated = serverPagination;
  const page = isServerPaginated ? (serverPage ?? 1) : clientPage;
  const pageSize = isServerPaginated ? (serverPageSize ?? initialPageSize) : clientPageSize;
  const total = isServerPaginated ? (serverTotal ?? data.length) : data.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const pagedData = React.useMemo(() => {
    if (disablePagination || isServerPaginated) return data;
    const start = (safePage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, disablePagination, isServerPaginated, pageSize, safePage]);

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <Table appearance={appearance}>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead
                key={c.id}
                numeric={c.numeric}
                className={cn(c.className, c.headerClassName)}
              >
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-10 text-center text-on-surface-variant"
              >
                {emptyState ?? "No results found."}
              </TableCell>
            </TableRow>
          ) : (
            pagedData.map((row, idx) => {
              const rowKey = getRowId
                ? getRowId(row, idx)
                : `row-${(page - 1) * pageSize + idx}`;
              return (
                <TableRow
                  key={rowKey}
                  striped={striped}
                  tabIndex={onRowClick ? 0 : undefined}
                  role={onRowClick ? "button" : undefined}
                  aria-label={onRowClick ? getRowAriaLabel?.(row, idx) : undefined}
                  className={cn(
                    onRowClick &&
                      "group/row cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-on-tertiary-container/35",
                    getRowClassName?.(row, idx),
                  )}
                  onClick={onRowClick ? () => onRowClick(row, idx) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onRowClick(row, idx);
                          }
                        }
                      : undefined
                  }
                >
                  {columns.map((c) => (
                    <TableCell
                      key={c.id}
                      numeric={c.numeric}
                      className={c.className}
                    >
                      {c.cell(row, idx)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
        {caption ? <TableCaption>{caption}</TableCaption> : null}
      </Table>

      {!disablePagination && total > 0 ? (
        <TablePagination
          page={safePage}
          pageSize={pageSize}
          total={total}
          onPageChange={isServerPaginated ? (onPageChange ?? setClientPage) : setClientPage}
          onPageSizeChange={(size) => {
            if (isServerPaginated) {
              onPageSizeChange?.(size);
              return;
            }
            setClientPageSize(size);
            setClientPage(1);
          }}
          pageSizeOptions={pageSizeOptions}
        />
      ) : null}
    </div>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TablePagination,
  DataTable,
};
