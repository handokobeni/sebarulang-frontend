/**
 * Test Setup Utilities
 * Shared test helpers and utilities
 */

import { QueryClient } from "@tanstack/react-query";

/**
 * Create a test QueryClient with no retries for faster tests
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Wait for async operations to complete
 */
export function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

