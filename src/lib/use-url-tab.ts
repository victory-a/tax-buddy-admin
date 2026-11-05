"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Keeps the active tab in `?tab=` (same pattern as frontend Rules).
 * Omits the query param when `tab` equals `defaultTab`.
 */
export function useUrlTab<T extends string>(
  allowed: readonly T[],
  defaultTab: T,
): { activeTab: T; setActiveTab: (tab: T) => void } {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = React.useMemo(() => {
    const raw = searchParams.get("tab");
    if (raw && (allowed as readonly string[]).includes(raw)) return raw as T;
    return defaultTab;
  }, [allowed, defaultTab, searchParams]);

  const setActiveTab = React.useCallback(
    (tab: T) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tab === defaultTab) params.delete("tab");
      else params.set("tab", tab);

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [defaultTab, pathname, router, searchParams],
  );

  return { activeTab, setActiveTab };
}
