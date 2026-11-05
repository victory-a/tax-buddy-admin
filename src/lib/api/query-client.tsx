"use client";

import * as React from "react";
import {
  QueryClient,
  QueryClientProvider,
  type DefaultOptions,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { env } from "@/lib/env";
import { isApiError } from "@/lib/api/client";

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (isApiError(error)) {
        if (error.isNetworkError) return failureCount < 2;
        if (error.status >= 400 && error.status < 500) return false;
        if (error.status >= 500) return failureCount < 1;
      }
      return failureCount < 1;
    },
  },
  mutations: {
    retry: false,
  },
};

function makeQueryClient(): QueryClient {
  return new QueryClient({ defaultOptions });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {env.IS_DEVELOPMENT ? (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
      ) : null}
    </QueryClientProvider>
  );
}
