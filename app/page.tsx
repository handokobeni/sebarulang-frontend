/**
 * Home Page - Hello World
 * Proof of concept untuk verify semua setup working
 */

// Force dynamic rendering untuk access nonce
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <main className="w-full max-w-2xl text-center">
        <h1 className="mb-6 text-6xl font-bold text-gray-900">
          Hello World
        </h1>
        <p className="mb-8 text-xl text-gray-600">
          Sebarulang Frontend - Phase 1.1 Setup Complete
        </p>
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Infrastructure Ready
          </h2>
          <ul className="space-y-2 text-left text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Next.js 16+ dengan App Router (React 19)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              TypeScript Strict Mode
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Tailwind CSS
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              API Client (Axios) dengan Interceptors
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              TanStack Query dengan Optimal Caching
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Zustand Store untuk Global State
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Error Boundaries
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Sentry Monitoring (dengan Quota Optimization)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Testing Infrastructure (Jest + Playwright + Cucumber)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              CI/CD Pipeline (GitHub Actions)
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
