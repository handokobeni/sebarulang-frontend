# CSP Nonce Usage

## Overview

Security headers dengan CSP (Content Security Policy) menggunakan nonce-based approach untuk lebih aman daripada `'unsafe-inline'`.

## How It Works

1. **Proxy** (`proxy.ts`) generates random nonce untuk setiap request
2. Nonce di-set di request header `x-nonce`
3. CSP header menggunakan nonce untuk allow inline scripts/styles
4. Components bisa access nonce via `getNonce()` utility

## Usage in Server Components

```typescript
// app/layout.tsx atau Server Components
import { getNonce } from "@/lib/utils/nonce";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const nonce = await getNonce();
  
  return (
    <html lang="id">
      <head>
        {/* Inline script dengan nonce */}
        <script
          nonce={nonce || undefined}
          dangerouslySetInnerHTML={{
            __html: `
              // Your inline script here
              console.log('App initialized');
            `,
          }}
        />
        
        {/* Inline style dengan nonce */}
        <style
          nonce={nonce || undefined}
          dangerouslySetInnerHTML={{
            __html: `
              /* Your inline styles here */
              body { margin: 0; }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Usage in Client Components

Client Components tidak bisa langsung access nonce karena mereka render di browser. Jika perlu nonce di Client Components:

1. Pass nonce sebagai prop dari Server Component
2. Atau gunakan data attributes dan set via Server Component

```typescript
// Server Component
const nonce = await getNonce();

// Client Component
'use client';

export function ClientScript({ nonce }: { nonce: string | null }) {
  useEffect(() => {
    // Client-side scripts don't need nonce attribute
    // But CSP nonce in header will still protect
    console.log('Client script executed');
  }, []);
  
  return null;
}
```

## Best Practices

1. **Avoid inline scripts/styles** - Gunakan external files jika mungkin
2. **Use nonce only when necessary** - Untuk third-party scripts yang require inline
3. **Never hardcode nonce** - Always get from `getNonce()`
4. **Test CSP in production** - CSP bisa break jika tidak configured correctly

## CSP Configuration

CSP di-configure di `proxy.ts` dengan directives:
- `script-src 'self' 'nonce-{nonce}'` - Allow scripts dengan nonce
- `style-src 'self' 'nonce-{nonce}'` - Allow styles dengan nonce
- `connect-src 'self' {API_URL}` - Allow API connections
- Dan lainnya sesuai security requirements

