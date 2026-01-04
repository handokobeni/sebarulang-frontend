/**
 * Sentry Configuration
 * Error tracking with quota optimization (5,000 errors/month free tier)
 */

import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/env";

// Initialize Sentry hanya di production
if (env.isProduction && env.sentry.dsn) {
  Sentry.init({
    dsn: env.sentry.dsn,
    environment: process.env.NODE_ENV,

    // ✅ OPTIMASI 1: Reduce sample rate untuk transactions
    // Hanya track 10% transactions (hemat 90% quota)
    tracesSampleRate: 0.1,

    // ✅ OPTIMASI 2: Keep 100% errors (important untuk debugging)
    sampleRate: 1.0,

    // ✅ OPTIMASI 3: Filter duplicate errors dan non-critical errors
    beforeSend(event, hint) {
      const error = hint.originalException;

      // Skip network errors (too common, not critical)
      if (error instanceof Error) {
        // Network errors (offline, timeout, etc.)
        if (
          error.message.includes("Network") ||
          error.message.includes("Failed to fetch") ||
          error.message.includes("timeout") ||
          error.message.includes("ERR_NETWORK")
        ) {
          // Skip network errors (bisa consume banyak quota)
          return null;
        }

        // Skip known non-critical errors
        if (
          error.message.includes("ResizeObserver") ||
          error.message.includes("Non-Error promise rejection")
        ) {
          return null;
        }
      }

      // ✅ OPTIMASI 4: Don't send sensitive data
      if (event.request) {
        // Remove sensitive headers
        if (event.request.headers) {
          delete (event.request.headers as any).Authorization;
          delete (event.request.headers as any).Cookie;
        }

        // Remove sensitive query params
        if (event.request.query_string) {
          const params = new URLSearchParams(event.request.query_string);
          params.delete("token");
          params.delete("password");
          event.request.query_string = params.toString();
        }
      }

      // ✅ OPTIMASI 5: Add tags untuk better filtering di Sentry dashboard
      event.tags = {
        ...event.tags,
        environment: process.env.NODE_ENV,
        app: "sebarulang",
      };

      return event;
    },

    // ✅ OPTIMASI 6: Filter breadcrumbs (reduce data sent)
    beforeBreadcrumb(breadcrumb) {
      // Skip navigation breadcrumbs (too verbose)
      if (breadcrumb.category === "navigation") {
        return null;
      }

      // Don't log sensitive data
      if (breadcrumb.data) {
        delete (breadcrumb.data as any).password;
        delete (breadcrumb.data as any).token;
        delete (breadcrumb.data as any).secret;
      }

      return breadcrumb;
    },

    // ✅ OPTIMASI 7: Ignore specific errors
    ignoreErrors: [
      // Browser extensions
      "top.GLOBALS",
      "originalCreateNotification",
      "canvas.contentDocument",
      // Network errors (handled in beforeSend)
      "NetworkError",
      "Network request failed",
      // Known non-critical errors
      "ResizeObserver loop limit exceeded",
      "Non-Error promise rejection",
    ],

    // ✅ OPTIMASI 8: Reduce max breadcrumbs (default: 100)
    maxBreadcrumbs: 50, // Reduce dari 100 ke 50

    // ✅ OPTIMASI 9: BrowserTracing is automatically included in @sentry/nextjs
    // No need to manually add it
  });
}

