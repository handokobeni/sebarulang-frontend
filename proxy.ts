/**
 * Next.js Proxy
 * Handles security headers dengan CSP nonce-based
 * 
 * Note: Next.js 16+ uses "proxy" instead of "middleware" convention
 * Proxy runs in Node.js runtime (not Edge Runtime)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";

/**
 * Generate random nonce using Node.js crypto (Node.js runtime compatible)
 * Proxy runs in Node.js runtime, so we can use Node.js crypto module
 */
function generateNonce(): string {
  // Generate 16 random bytes using Node.js crypto
  return crypto.randomBytes(16).toString("base64");
}

export function proxy(request: NextRequest) {
  // Generate random nonce for each request
  const nonce = generateNonce();

  // Clone request headers
  const requestHeaders = new Headers(request.headers);

  // Add nonce to request headers (accessible in pages/components)
  requestHeaders.set("x-nonce", nonce);

  // Create response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const isDev = process.env.NODE_ENV === "development";

  // Build CSP with nonce
  const cspDirectives = [
    "default-src 'self'",
    // Scripts:
    // - 'self' for external scripts from same origin (including _next/static)
    // - 'nonce-{nonce}' for custom inline scripts with nonce
    // - 'unsafe-inline' required for Next.js inline scripts (hydration, etc.)
    // - 'unsafe-eval' in dev ONLY for Next.js hot reload (required)
    // Note: Next.js App Router may generate inline scripts for hydration,
    // so 'unsafe-inline' is necessary. Nonce is still used for custom scripts.
    isDev
      ? `script-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval'`
      : `script-src 'self' 'nonce-${nonce}'`,
    // Styles:
    // - 'self' for external styles from same origin
    // - 'nonce-{nonce}' for custom inline styles with nonce
    // - 'unsafe-inline' required for Next.js inline styles (font loading, CSS-in-JS)
    // Note: Next.js generates inline styles for font optimization and CSS-in-JS,
    // especially in development mode. 'unsafe-inline' is necessary.
    isDev
      ? `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`
      : `style-src 'self' 'nonce-${nonce}'`,
    // Images: self + data URIs + external HTTPS
    "img-src 'self' data: https:",
    // Fonts: self only
    "font-src 'self'",
    // Connections: self + API
    `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}`,
    // Frames: none (prevent clickjacking)
    "frame-ancestors 'none'",
    // Base URI: self only
    "base-uri 'self'",
    // Form actions: self only
    "form-action 'self'",
    // Object/embed: none
    "object-src 'none'",
    // Upgrade insecure requests (only in production)
    ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
  ];

  const csp = cspDirectives.join("; ");

  // Set security headers
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  // HSTS (only in production with HTTPS)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

