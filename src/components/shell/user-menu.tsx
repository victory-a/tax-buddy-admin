"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut, MoreHorizontal, User } from "lucide-react";

import { Button } from "@/components/ui";
import { authMeQueryKey, logout } from "@/lib/api/session";
import { userInitials } from "@/lib/user-display";
import { cn } from "@/lib/utils";

type UserMenuProps = {
  email: string;
  name: string | null;
  avatarUrl: string | null;
  collapsed?: boolean;
};

export function UserMenu({ email, name, avatarUrl, collapsed = false }: UserMenuProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const initials = userInitials(name, email);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authMeQueryKey });
      window.location.assign("/login");
    },
  });

  const wrapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const displayName = name?.trim() || "Account";

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="User menu"
        className={cn(
          collapsed
            ? "mx-auto flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-outline-variant/60 bg-surface-container-low/80 transition-colors hover:bg-surface-container-low"
            : "flex w-full items-center gap-3 rounded-xl border border-outline-variant/50 bg-surface-container-low/50 p-2 pr-2.5 text-left transition-colors hover:bg-surface-container-low",
          "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        <UserMenuAvatar avatarUrl={avatarUrl} initials={initials} collapsed={collapsed} />
        {!collapsed ? (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-body-md text-on-surface">
                {displayName}
              </span>
              <span className="block truncate text-body-sm text-on-surface-variant">{email}</span>
            </span>
            <MoreHorizontal className="size-4 shrink-0 text-on-surface-variant" aria-hidden />
          </>
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute bottom-full left-0 right-0 z-50 mb-2 w-full overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-lowest py-1 shadow-elevated"
        >
          <div className="p-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              role="menuitem"
              className="w-full justify-start gap-2 text-on-surface"
              disabled={logoutMutation.isPending}
              onClick={() => {
                setOpen(false);
                logoutMutation.mutate();
              }}
              iconLeft={<LogOut className="size-4" aria-hidden />}
            >
              {logoutMutation.isPending ? "Signing out…" : "Log out"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function UserMenuAvatar({
  avatarUrl,
  initials,
  collapsed,
}: {
  avatarUrl: string | null;
  initials: string;
  collapsed: boolean;
}) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const showImage = Boolean(avatarUrl) && !imgFailed;

  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-container-high text-on-surface",
        collapsed ? "h-full w-full" : "h-10 w-10",
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote OAuth avatar URL
        <img
          src={avatarUrl!}
          alt=""
          width={40}
          height={40}
          className="h-full w-full object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : initials.length >= 1 ? (
        <span className="text-body-sm font-semibold tabular-nums tracking-tight">{initials}</span>
      ) : (
        <User className="size-5 text-on-surface-variant" aria-hidden />
      )}
    </span>
  );
}
