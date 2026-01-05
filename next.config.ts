import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // Disable PWA in development
  runtimeCaching: [
    {
      // Cache images from Unsplash
      urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "unsplash-images",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      // Cache API responses with NetworkFirst strategy (fresh data priority)
      urlPattern: ({ url }: { url: URL }) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        return url.origin === new URL(apiUrl).origin;
      },
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24, // 1 day
        },
        networkTimeoutSeconds: 10,
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      // Cache static assets (JS, CSS, fonts)
      urlPattern: /\.(?:js|css|woff|woff2|ttf|otf)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    {
      // Cache pages with NetworkFirst (prefer fresh content)
      urlPattern: ({ request }: { request: Request }) =>
        request.destination === "document",
      handler: "NetworkFirst",
      options: {
        cacheName: "pages-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 1 day
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

const nextConfig: NextConfig = {
  // Disable X-Powered-By header (security: hide server information)
  poweredByHeader: false,
  // Security headers are handled in proxy.ts with CSP nonce
  // Only static headers that don't need nonce are set here
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          // Attempt to override/remove headers that leak server information
          // Note: Vercel may still add these headers at infrastructure level
          {
            key: "Server",
            value: "", // Empty string to attempt removal
          },
          {
            key: "Age",
            value: "", // Empty string to attempt removal
          },
          // Note: CSP, X-Frame-Options, X-Content-Type-Options, etc.
          // are set in proxy.ts to support nonce-based CSP
        ],
      },
    ];
  },
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // Add other image domains as needed
      {
        protocol: "https",
        hostname: "**.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  // React strict mode
  reactStrictMode: true,
  // Turbopack config (empty to silence warning, webpack config still works when ANALYZE=true)
  turbopack: {},
  // Bundle analyzer (only in development when ANALYZE=true)
  // Note: webpack config is only used when ANALYZE=true, otherwise Turbopack is used
  ...(process.env.ANALYZE === "true" && {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webpack: (config: any) => {
      if (config.mode === "production") {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { BundleAnalyzerPlugin } = require("@next/bundle-analyzer");
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
          })
        );
      }
      return config;
    },
  }),
};

// Export with PWA wrapper
export default withPWA(nextConfig);
