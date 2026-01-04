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

  // Get allowed image domains from environment variable (comma-separated)
  // Example: NEXT_PUBLIC_IMAGE_DOMAINS=https://cdn.example.com,https://images.unsplash.com
  // const imageDomains = process.env.NEXT_PUBLIC_IMAGE_DOMAINS
  //   ? process.env.NEXT_PUBLIC_IMAGE_DOMAINS.split(",").map((d) => d.trim())
  //   : [];

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
    // Images: self + data URIs + specific allowed domains
    // Security: No wildcard 'https:' - only allow specific domains via NEXT_PUBLIC_IMAGE_DOMAINS
    // For Cloudflare R2, add your R2 public URL or custom domain
    // Example: NEXT_PUBLIC_IMAGE_DOMAINS=https://pub-xxx.r2.dev,https://cdn.sebarulang.com
    `img-src 'self'`,
    // `img-src 'self' data: ${imageDomains.join(" ")}`,
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

  // Remove headers that leak server information (security)
  // Note: Vercel may add these headers after proxy, so we try multiple approaches
  response.headers.delete("X-Powered-By");
  response.headers.delete("Server");
  response.headers.delete("Age");
  response.headers.delete("X-Vercel-Cache"); // Also remove Vercel cache header
  
  // Set headers to empty string as fallback (some proxies respect this)
  // This is a workaround for headers added by Vercel infrastructure
  response.headers.set("Server", "");
  response.headers.set("Age", "");

  // Set strict cache control to prevent caching of sensitive content
  // This prevents shared cache from storing user-specific or sensitive data
  // Important: Set this AFTER removing Age header to prevent cache information leak
  //
  // Cache-Control directives explained:
  // - private: Content tidak boleh di-cache oleh shared cache (CDN, proxy) - hanya browser cache
  // - no-cache: Browser harus revalidate dengan server sebelum menggunakan cached content
  // - no-store: Content tidak boleh disimpan di cache sama sekali (browser atau shared cache)
  // - max-age=0: Browser cache immediately expired (0 detik)
  // - must-revalidate: Browser harus revalidate expired content dengan server
  // - proxy-revalidate: Shared cache (proxy/CDN) harus revalidate expired content
  // - s-maxage=0: Shared cache (CDN, proxy, Vercel edge) tidak boleh cache lebih dari 0 detik
  //   (immediate expiration untuk shared cache - ini penting untuk prevent cache information leak)
  response.headers.set(
    "Cache-Control",
    "private, no-cache, no-store, max-age=0, must-revalidate, proxy-revalidate, s-maxage=0"
  );

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

