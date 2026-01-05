/**
 * Sentry Client Configuration
 * Client-side error tracking
 */

import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/env";

if (env.isProduction && env.sentry.dsn) {
  Sentry.init({
    dsn: env.sentry.dsn,
    environment: process.env.NODE_ENV,

    // Same optimizations as server config
    tracesSampleRate: 0.1,
    sampleRate: 1.0,

    beforeSend(event, hint) {
      const error = hint.originalException;
      if (error instanceof Error) {
        if (
          error.message.includes("Network") ||
          error.message.includes("Failed to fetch") ||
          error.message.includes("timeout")
        ) {
          return null; // Skip network errors
        }
      }

      // Remove sensitive data
      if (event.request?.headers) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (event.request.headers as any).Authorization;
      }

      return event;
    },

    ignoreErrors: [
      "NetworkError",
      "ResizeObserver loop limit exceeded",
    ],

    maxBreadcrumbs: 50,
  });
}

