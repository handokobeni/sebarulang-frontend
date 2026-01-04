/**
 * Nonce Utility
 * Get nonce from request headers for CSP
 */

import { headers } from "next/headers";

/**
 * Get nonce from request headers
 * Use this in Server Components to get the nonce for inline scripts/styles
 */
export async function getNonce(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get("x-nonce");
}

/**
 * Get nonce synchronously (for use in proxy or client components)
 * Note: This should only be used when nonce is already available in context
 */
export function getNonceSync(): string | null {
  // This is a fallback - in most cases, use getNonce() in Server Components
  if (typeof window !== "undefined") {
    // Client-side: nonce should be passed via props or context
    return null;
  }
  return null;
}

