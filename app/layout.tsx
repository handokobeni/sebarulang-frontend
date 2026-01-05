import type { Metadata } from "next";
import "./globals.css";
import { QueryProviders } from "@/lib/query/providers";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { getNonce } from "@/lib/utils/nonce";
import { ToastProvider } from "./components/ui/toast-simple";

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
      </head>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <ToastProvider>
            <QueryProviders>{children}</QueryProviders>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
