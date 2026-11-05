"use client";

import { usePathname } from "next/navigation";

import { useAuthSession } from "@/components/auth/auth-session-provider";
import { cn } from "@/lib/utils";

import { SidebarBrand } from "./sidebar-brand";
import { SIDEBAR_NAV } from "./sidebar-nav";
import { SidebarNavSection } from "./sidebar-nav-section";
import { UserMenu } from "./user-menu";

export type AdminSidebarProps = {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
};

export function AdminSidebar({ collapsed, onCollapsedChange }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user: me, isPending } = useAuthSession();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-outline-variant/50",
        "bg-surface-container-lowest/95 backdrop-blur-sm transition-[width] duration-200 ease-out motion-reduce:transition-none",
        collapsed ? "w-[76px]" : "w-[260px]",
      )}
    >
      <SidebarBrand collapsed={collapsed} onCollapsedChange={onCollapsedChange} />

      <nav
        id="admin-sidebar-nav"
        aria-label="Admin"
        className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-2 pb-3 pt-3"
      >
        <SidebarNavSection
          title="Console"
          items={SIDEBAR_NAV}
          pathname={pathname}
          collapsed={collapsed}
        />
      </nav>

      <div className="shrink-0 border-t border-outline-variant/50 p-2">
        {isPending ? (
          <div
            className={cn(
              "rounded-xl bg-surface-container-high animate-pulse",
              collapsed ? "mx-auto h-11 w-11 rounded-full" : "h-[72px]",
            )}
          />
        ) : me ? (
          <UserMenu
            collapsed={collapsed}
            email={me.email}
            name={me.name}
            avatarUrl={me.avatarUrl}
          />
        ) : null}
      </div>
    </aside>
  );
}
