/**
 * Sentry Edge Configuration
 * Edge runtime error tracking
 */

import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/env";

if (env.isProduction && env.sentry.dsn) {
  Sentry.init({
    dsn: env.sentry.dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    sampleRate: 1.0,
  });
}

