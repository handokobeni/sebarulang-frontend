import type { NextConfig } from "next";

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
  },
  // React strict mode
  reactStrictMode: true,
  // Bundle analyzer (only in development when ANALYZE=true)
  ...(process.env.ANALYZE === "true" && {
    webpack: (config: any) => {
      if (config.mode === "production") {
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

export default nextConfig;
