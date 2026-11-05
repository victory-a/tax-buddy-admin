"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { useAdminUsers } from "@/lib/api/admin-users";
import { Button, TextInput } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TablePagination,
  TableRow,
} from "@/components/ui/table";

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function UsersView() {
  const router = useRouter();
  const [draft, setDraft] = React.useState("");
  const [q, setQ] = React.useState("");
  const [page, setPage] = React.useState(1);

  const { data, isPending, isError, error, refetch, isFetching } = useAdminUsers({ q, page });

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2 max-w-3xl">
        <h1 className="font-display text-headline-lg tracking-tight text-on-surface">Users</h1>
        <p className="text-body-md text-on-surface-variant">
          Search accounts, override billing, revoke sessions. Free-use limit is{" "}
          <span className="text-on-surface font-medium">{data?.freeUsesLimit ?? "…"}</span>{" "}
          (env, read-only).
        </p>
      </header>

      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setQ(draft.trim());
        }}
      >
        <div className="w-full max-w-md">
          <TextInput
            label="Search"
            name="q"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Email or name"
            autoComplete="off"
          />
        </div>
        <Button type="submit" variant="primary" iconLeft={<Search aria-hidden />}>
          Search
        </Button>
      </form>

      {isPending ? (
        <div className="h-48 rounded-2xl bg-surface-container-high animate-pulse" />
      ) : isError ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-error/30 bg-error-container/40 px-4 py-5">
          <p className="text-body-md text-on-error-container">
            {error instanceof Error ? error.message : "Could not load users."}
          </p>
          <Button type="button" variant="outlined" size="sm" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Table appearance="plain">
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Free uses</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-on-surface-variant">
                    No users match{q ? ` “${q}”` : ""}.
                  </TableCell>
                </TableRow>
              ) : (
                data.items.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/users/${user.id}`)}
                  >
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <Link
                          href={`/users/${user.id}`}
                          className="font-medium text-on-surface hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {user.name?.trim() || user.email}
                        </Link>
                        <span className="text-body-sm text-on-surface-variant">{user.email}</span>
                        {user.isAdmin ? (
                          <span className="text-body-sm font-medium text-secondary">Staff</span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.isPaid ? (
                        <span>
                          Paid
                          {user.paidUntil ? (
                            <span className="block text-body-sm text-on-surface-variant">
                              until {formatDate(user.paidUntil)}
                            </span>
                          ) : (
                            <span className="block text-body-sm text-on-surface-variant">
                              open-ended
                            </span>
                          )}
                        </span>
                      ) : user.canUse ? (
                        "Free"
                      ) : (
                        <span className="text-error">Blocked</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.freeUsesUsed}/{user.freeUsesLimit}
                    </TableCell>
                    <TableCell className="text-body-sm text-on-surface-variant">
                      {formatDate(user.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-1">
            {isFetching ? (
              <p className="text-body-sm text-on-surface-variant">Refreshing…</p>
            ) : null}
            <TablePagination
              page={page}
              pageSize={data.pageSize}
              total={data.total}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </main>
  );
}
