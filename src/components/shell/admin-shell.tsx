"use client";

import * as React from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { AdminSidebar } from "./admin-sidebar";

const SIDEBAR_EXPANDED_PX = 260;
const SIDEBAR_COLLAPSED_PX = 76;

export function AdminShell({ children }: Readonly<{ children: ReactNode }>) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="relative min-h-screen flex-1 bg-background">
      <AdminSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden transition-[padding] duration-200 ease-out motion-reduce:transition-none",
        )}
        style={{
          paddingLeft: collapsed ? SIDEBAR_COLLAPSED_PX : SIDEBAR_EXPANDED_PX,
        }}
      >
        {children}
      </div>
    </div>
  );
}
