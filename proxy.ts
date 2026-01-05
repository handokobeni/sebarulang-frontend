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
  // Default: Allow Unsplash for demo/development purposes
  const defaultImageDomains = ["https://images.unsplash.com"];
  const envImageDomains = process.env.NEXT_PUBLIC_IMAGE_DOMAINS
    ? process.env.NEXT_PUBLIC_IMAGE_DOMAINS.split(",").map((d) => d.trim())
    : [];
  const imageDomains = [...defaultImageDomains, ...envImageDomains];

  // Build CSP with nonce
  const cspDirectives = [
    "default-src 'self'",
    // Scripts:
    // - 'self' for external scripts from same origin (including _next/static)
    // - 'nonce-{nonce}' for custom inline scripts with nonce
    // - 'unsafe-inline' in dev ONLY for Next.js hot reload, HMR, and development tools
    // - 'unsafe-eval' in dev ONLY for Next.js hot reload and webpack (required)
    // Note: Next.js di development mode menghasilkan BANYAK inline scripts untuk:
    // - Hot Module Replacement (HMR)
    // - Webpack dev server
    // - React Fast Refresh
    // - Development error overlays
    // Di production, Next.js sudah optimize dan tidak generate banyak inline scripts,
    // sehingga tidak perlu 'unsafe-inline' untuk script-src.
    isDev
      ? `script-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval'`
      : `script-src 'self' 'nonce-${nonce}'`,
    // Styles:
    // - 'self' for external styles from same origin
    // - 'nonce-{nonce}' for custom inline styles with nonce
    // - 'unsafe-inline' in dev ONLY for Next.js hot reload and development tools
    // - Hash-based CSP untuk Next.js inline styles di production (tanpa 'unsafe-inline')
    // Note: Next.js generates inline styles untuk font optimization.
    // Di development, Next.js hot reload memerlukan 'unsafe-inline' untuk styles.
    // Di production, kita menggunakan hash-based CSP untuk lebih strict.
    // Untuk styles yang kita kontrol, gunakan nonce.
    // Common Next.js inline style hashes (akan di-update jika ada perubahan)
    // Hash ini dihitung dari inline styles yang di-generate oleh Next.js
    // Untuk menambahkan hash baru, gunakan: echo -n "style-content" | openssl dgst -sha256 -binary | openssl base64
    isDev
      ? `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`
      : `style-src 'self' 'nonce-${nonce}'`,
    // Images: self + data URIs + specific allowed domains
    // Security: No wildcard 'https:' - only allow specific domains via NEXT_PUBLIC_IMAGE_DOMAINS
    // For Cloudflare R2, add your R2 public URL or custom domain
    // Example: NEXT_PUBLIC_IMAGE_DOMAINS=https://pub-xxx.r2.dev,https://cdn.sebarulang.com
    // Default: Allow Unsplash (https://images.unsplash.com) for demo purposes
    `img-src 'self' data: ${imageDomains.join(" ")}`,
    // Fonts: self only
    "font-src 'self'",
    // Connections: self + API
    // In development, also allow WebSocket connections for Next.js HMR (Hot Module Replacement)
    isDev
      ? `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"} ws://localhost:* wss://localhost:* ws://127.0.0.1:* wss://127.0.0.1:*`
      : `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}`,
    // Frames: none (prevent clickjacking)
    "frame-ancestors 'none'",
    // Base URI: self only
    "base-uri 'self'",
    // Form actions: self only
    "form-action 'self'",
    // Object/embed: none
    "object-src 'none'",
    // Workers: self + blob for service worker (PWA)
    // Service worker requires blob: untuk registration
    // Development: allow blob: for webpack workers and service worker
    // Production: allow blob: for service worker registration
    "worker-src 'self' blob:",
    // Manifest: self only (for manifest.json)
    "manifest-src 'self'",
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

