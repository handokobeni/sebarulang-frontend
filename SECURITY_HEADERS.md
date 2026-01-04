# Security Headers Implementation

## Overview

Security headers diimplementasikan dengan CSP (Content Security Policy) menggunakan **nonce-based approach** untuk keamanan yang lebih baik.

## Implementation

### 1. Proxy (`proxy.ts`)

Proxy menangani:
- **Nonce Generation**: Generate random nonce untuk setiap request
- **CSP Header**: Set CSP dengan nonce untuk scripts dan styles
- **Security Headers**: Set semua security headers

**Note**: Next.js 16+ uses "proxy" instead of "middleware" convention. Proxy runs in Node.js runtime.

### 2. Security Headers yang Di-set

| Header | Value | Purpose |
|--------|-------|---------|
| `Content-Security-Policy` | Nonce-based CSP | Prevent XSS attacks |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME type sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | XSS protection (legacy browsers) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer information |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` | Restrict browser features |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS (production only) |

### 2.1. Headers yang Di-Remove

| Header | Action | Reason |
|--------|--------|--------|
| `X-Powered-By` | **Removed** | Hide server information (security best practice) |
| `Server` | **Removed** | Hide server information (Vercel header) |
| `Age` | **Removed** | Prevent cache information leak (security best practice) |

**Implementation**:
- `next.config.ts`: `poweredByHeader: false` - Disable Next.js X-Powered-By header
- `proxy.ts`: Remove headers yang leak information (`X-Powered-By`, `Server`, `Age`)

### 2.2. Cache Control

**Strict Cache Control** untuk prevent caching sensitive content:

```
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate, proxy-revalidate
```

**Purpose**:
- `private`: Content tidak boleh di-cache oleh shared cache (CDN, proxy)
- `no-cache`: Browser harus revalidate dengan server sebelum menggunakan cached content
- `no-store`: Content tidak boleh disimpan di cache sama sekali
- `max-age=0`: Content immediately expired
- `must-revalidate`: Browser harus revalidate expired content
- `proxy-revalidate`: Proxy cache harus revalidate expired content

**Security Benefit**:
- Mencegah shared cache (CDN, proxy) menyimpan user-specific atau sensitive data
- Mencegah cache poisoning attacks
- Mencegah information leak melalui cached content

### 3. CSP Directives

```
default-src 'self'
script-src 'self' 'nonce-{nonce}' 'unsafe-inline' ['unsafe-eval' in dev only]
style-src 'self' 'nonce-{nonce}' 'unsafe-inline'
img-src 'self' data: [specific domains from NEXT_PUBLIC_IMAGE_DOMAINS]
font-src 'self'
connect-src 'self' {API_URL}
frame-ancestors 'none'
base-uri 'self'
form-action 'self'
object-src 'none'
upgrade-insecure-requests (production only)
```

**Note tentang `img-src`**:
- **No wildcard `https:`**: Untuk security, tidak menggunakan wildcard `https:`
- **Specific domains only**: Hanya allow specific domains via `NEXT_PUBLIC_IMAGE_DOMAINS`
- **Default**: Hanya `'self'` dan `data:` (untuk inline images)
- **External images**: Set `NEXT_PUBLIC_IMAGE_DOMAINS` dengan comma-separated domains
  - Example: `NEXT_PUBLIC_IMAGE_DOMAINS=https://cdn.example.com,https://images.unsplash.com`
  - For Cloudflare R2: `NEXT_PUBLIC_IMAGE_DOMAINS=https://pub-xxx.r2.dev`

**Note tentang `'unsafe-inline'`**:
- **Required untuk Next.js**: Next.js App Router meng-generate inline scripts/styles secara otomatis (hydration, font loading, CSS-in-JS)
- **Nonce tetap digunakan**: Nonce masih digunakan untuk custom inline scripts/styles yang kita buat sendiri
- **Security trade-off**: `'unsafe-inline'` mengurangi security, tapi diperlukan untuk Next.js compatibility
- **Best practice**: Untuk custom scripts/styles, selalu gunakan nonce. `'unsafe-inline'` hanya untuk Next.js internal scripts

## Nonce Usage

### Get Nonce in Server Components

```typescript
import { getNonce } from "@/lib/utils/nonce";

const nonce = await getNonce();
```

### Use Nonce in Inline Scripts/Styles

```typescript
<script nonce={nonce || undefined}>
  // Inline script
</script>

<style nonce={nonce || undefined}>
  /* Inline styles */
</style>
```

## Development vs Production

### Development
- `unsafe-inline` allowed untuk Next.js inline scripts/styles
- `unsafe-eval` allowed untuk Next.js hot reload
- `upgrade-insecure-requests` tidak di-set (HTTP allowed)

### Production
- `unsafe-inline` allowed untuk Next.js inline scripts/styles (required)
- `unsafe-eval` NOT allowed (more secure)
- `upgrade-insecure-requests` enabled
- HSTS header enabled

**Why `'unsafe-inline'` is needed**:
- Next.js App Router generates inline scripts for hydration
- Next.js generates inline styles for font optimization and CSS-in-JS
- These scripts/styles are generated dynamically and cannot use nonce
- Nonce is still used for custom inline scripts/styles we create

## Testing

### Verify Headers

```bash
# Start dev server
pnpm dev

# Check headers
curl -I http://localhost:3000
```

### Verify CSP

1. Open browser DevTools
2. Check Network tab → Response Headers
3. Look for `Content-Security-Policy` header
4. Verify nonce is present and unique per request

## Benefits

1. **XSS Prevention**: Nonce-based CSP lebih aman daripada `'unsafe-inline'`
2. **Selective**: Hanya allow inline scripts/styles dengan nonce yang valid
3. **Dynamic**: Nonce berbeda untuk setiap request
4. **Best Practice**: Recommended oleh OWASP

## Notes

- Nonce di-generate per request untuk security
- `'unsafe-inline'` diperlukan untuk Next.js internal scripts/styles
- Untuk custom inline scripts/styles, selalu gunakan nonce
- Third-party scripts perlu di-allow via CSP directives jika diperlukan
- Test CSP di production untuk ensure tidak ada false positives

## Security Considerations

### Why `'unsafe-inline'` is used

Next.js App Router memerlukan `'unsafe-inline'` karena:
1. **Hydration scripts**: Next.js generate inline scripts untuk React hydration
2. **Font optimization**: Next.js inject inline styles untuk font loading
3. **CSS-in-JS**: Next.js generate inline styles untuk styled components
4. **Dynamic generation**: Scripts/styles di-generate secara dinamis dan tidak bisa menggunakan nonce

### Mitigation Strategies

Meskipun menggunakan `'unsafe-inline'`, kita tetap aman karena:
1. **Nonce untuk custom scripts**: Custom inline scripts/styles tetap menggunakan nonce
2. **Other security headers**: X-Frame-Options, X-Content-Type-Options, dll masih aktif
3. **Input validation**: Zod validation untuk semua user input
4. **React auto-escaping**: React otomatis escape user content
5. **No `dangerouslySetInnerHTML`**: Hindari penggunaan `dangerouslySetInnerHTML` kecuali benar-benar diperlukan

### Future Improvements

Untuk meningkatkan security lebih lanjut:
1. **Hash-based CSP**: Gunakan hash untuk Next.js scripts (lebih kompleks)
2. **Strict CSP**: Remove `'unsafe-inline'` jika Next.js support nonce di masa depan
3. **Subresource Integrity**: Add SRI untuk external scripts

