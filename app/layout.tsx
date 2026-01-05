import type { Metadata, Viewport } from "next";
import "./globals.css";
import { QueryProviders } from "@/lib/query/providers";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { getNonce } from "@/lib/utils/nonce";
import { ToastProvider } from "./components/ui/toast-simple";
import { PWAInstallPrompt } from "@/shared/components/PWAInstallPrompt";

// Force dynamic rendering untuk access nonce di setiap request
export const dynamic = "force-dynamic";

// Font optimization disabled untuk menghindari inline styles yang di-generate oleh Next.js
// Ini memungkinkan kita menggunakan CSP tanpa 'unsafe-inline'
// Font akan di-load via external stylesheet (lebih aman untuk CSP)

export const metadata: Metadata = {
  title: {
    default: "Sebarulang - Berbagi Makanan, Mengurangi Food Waste",
    template: "%s | Sebarulang",
  },
  description:
    "Platform social media untuk berbagi makanan sisa yang masih layak dimakan. Menghubungkan Giver dengan Receiver untuk mengurangi food waste dan membantu mengatasi kelaparan di Indonesia.",
  keywords: [
    "food sharing",
    "food waste",
    "berbagi makanan",
    "makanan sisa",
    "Indonesia",
  ],
  authors: [{ name: "Sebarulang Team" }],
  creator: "Sebarulang",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://sebarulang.com",
    siteName: "Sebarulang",
    title: "Sebarulang - Berbagi Makanan, Mengurangi Food Waste",
    description:
      "Platform social media untuk berbagi makanan sisa yang masih layak dimakan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sebarulang - Berbagi Makanan, Mengurangi Food Waste",
    description:
      "Platform social media untuk berbagi makanan sisa yang masih layak dimakan.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sebarulang",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get nonce from request headers (set by proxy.ts)
  const nonce = await getNonce();

  return (
    <html lang="id">
      <head>
        {/* Inject nonce as meta tag untuk potential use di client */}
        {nonce && <meta name="csp-nonce" content={nonce} />}
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.svg" />
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sebarulang" />
      </head>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <ToastProvider>
            <QueryProviders>
              {children}
              <PWAInstallPrompt />
            </QueryProviders>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
