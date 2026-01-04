/**
 * Sentry Server Configuration
 * Server-side error tracking
 */

import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/env";

if (env.isProduction && env.sentry.serverDsn) {
  Sentry.init({
    dsn: env.sentry.serverDsn,
    environment: process.env.NODE_ENV,

    // Server-side: lebih strict filtering
    tracesSampleRate: 0.05, // Only 5% transactions (server lebih banyak requests)
    sampleRate: 1.0,

    beforeSend(event, hint) {
      // Same filtering logic as client
      const error = hint.originalException;
      if (error instanceof Error) {
        if (
          error.message.includes("Network") ||
          error.message.includes("timeout")
        ) {
          return null;
        }
      }

      return event;
    },
  });
}

