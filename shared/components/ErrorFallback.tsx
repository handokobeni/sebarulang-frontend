/**
 * Error Fallback Component
 * Displayed when Error Boundary catches an error
 */

"use client";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Something went wrong
          </h1>
          <p className="mb-6 text-gray-600">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="mb-4 text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-xs text-gray-800">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Refresh Page
            </button>
            {resetErrorBoundary && (
              <button
                onClick={resetErrorBoundary}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

