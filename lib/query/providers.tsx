/**
 * TanStack Query Provider
 * Wraps app with QueryClientProvider for server state management
 */

"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./query-client";
import { env } from "@/lib/env";
// Ensure API interceptors are initialized
import "@/lib/api";

interface QueryProvidersProps {
  children: React.ReactNode;
}

export function QueryProviders({ children }: QueryProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show devtools only in development */}
      {env.isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

