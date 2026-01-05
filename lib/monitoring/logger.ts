/**
 * Centralized Logging Utility
 * Logs errors to Sentry with quota optimization
 */

interface LogContext {
  component?: string;
  feature?: string;
  action?: string;
  [key: string]: unknown;
}

export function logError(error: Error, context?: LogContext): void {
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", error, context);
    return;
  }

  // Production: Send to Sentry
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window !== "undefined" && (window as any).Sentry) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Sentry.captureException(error, {
      extra: context,
      tags: {
        component: context?.component || "unknown",
        feature: context?.feature || "unknown",
      },
    });
  }
}

export function logWarning(message: string, context?: LogContext): void {
  if (process.env.NODE_ENV === "development") {
    console.warn("Warning:", message, context);
    return;
  }

  // Production: Only log warnings jika critical
  if (
    typeof window !== "undefined" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Sentry &&
    context?.critical
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Sentry.captureMessage(message, {
      level: "warning",
      extra: context,
    });
  }
}

export function logInfo(message: string, context?: LogContext): void {
  // Info logs tidak dikirim ke Sentry (hemat quota)
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("Info:", message, context);
  }
}

