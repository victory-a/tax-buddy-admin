import type * as React from "react";
import {
  Activity,
  Cpu,
  LayoutDashboard,
  ListTodo,
  Scale,
  Users,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  end?: boolean;
};

export const SIDEBAR_NAV: readonly NavItem[] = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard, end: true },
  { href: "/users", label: "Users", icon: Users },
  { href: "/queues", label: "Queues", icon: ListTodo },
  { href: "/rules", label: "Rules", icon: Scale },
  { href: "/models", label: "Models", icon: Cpu },
  { href: "/health", label: "Health", icon: Activity },
];

export function isActivePath(pathname: string, href: string, end?: boolean) {
  if (end) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
