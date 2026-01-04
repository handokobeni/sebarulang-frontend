# CORS Configuration Guide - Sebarulang Frontend

## Overview

Guide lengkap untuk konfigurasi CORS (Cross-Origin Resource Sharing) untuk Sebarulang Frontend dengan backend di domain berbeda.

---

## Frontend Configuration

### ✅ Sudah Dikonfigurasi

Frontend sudah dikonfigurasi dengan benar di `lib/api/client.ts`:

```typescript
const apiClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true, // ✅ CRITICAL: Include httpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});
```

**Key Points**:
- ✅ `withCredentials: true` - **WAJIB** untuk cross-domain cookies
- ✅ `baseURL` dari environment variable
- ✅ Content-Type header sudah di-set

---

## Backend Requirements

Backend **HARUS** dikonfigurasi dengan benar untuk support CORS dengan credentials.

### Required Backend Headers

Backend harus mengirim headers berikut:

```
Access-Control-Allow-Origin: https://sebarulang.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Expose-Headers: Set-Cookie
```

### Backend Environment Variables

**Untuk Production** (Cross-Domain):

```env
# Backend .env.production
CORS_ALLOWED_ORIGINS=https://sebarulang.com,https://www.sebarulang.com
COOKIE_SECURE=true
COOKIE_SAME_SITE=None
COOKIE_DOMAIN=
```

**Untuk Development** (Same-Origin atau Local):

```env
# Backend .env.local
CORS_ALLOWED_ORIGINS=http://localhost:3000
COOKIE_SECURE=false
COOKIE_SAME_SITE=Strict
COOKIE_DOMAIN=
```

---

## CSP Configuration untuk CORS

CSP `connect-src` harus include backend API URL. Sudah dikonfigurasi di `proxy.ts`:

```typescript
// proxy.ts - Line 78
`connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}`,
```

**Important**: 
- `connect-src` harus include backend domain
- Environment variable `NEXT_PUBLIC_API_URL` harus di-set dengan benar

---

## Deployment Scenarios

### Scenario 1: Same Domain, Different Subdomain (Recommended)

**Setup**:
- Frontend: `sebarulang.com` (Vercel)
- Backend: `api.sebarulang.com` (Cloud Run)

**Backend Configuration**:
```env
CORS_ALLOWED_ORIGINS=https://sebarulang.com,https://www.sebarulang.com
COOKIE_DOMAIN=.sebarulang.com
COOKIE_SAME_SITE=Strict
COOKIE_SECURE=true
```

**Frontend Configuration**:
```env
NEXT_PUBLIC_API_URL=https://api.sebarulang.com/api
```

**Benefits**:
- ✅ Bisa pakai `SameSite=Strict` (best CSRF protection)
- ✅ Cookies shared across subdomains
- ✅ More secure
- ✅ Better user experience

### Scenario 2: Different Domains

**Setup**:
- Frontend: `sebarulang.com` (Vercel)
- Backend: `sebarulang-backend-xxx.run.app` (Cloud Run)

**Backend Configuration**:
```env
CORS_ALLOWED_ORIGINS=https://sebarulang.com,https://www.sebarulang.com
COOKIE_DOMAIN=
COOKIE_SAME_SITE=None
COOKIE_SECURE=true
```

**Frontend Configuration**:
```env
NEXT_PUBLIC_API_URL=https://sebarulang-backend-xxx.run.app/api
```

**Important**:
- ⚠️ `SameSite=None` **MUST** dengan `Secure=true`
- ⚠️ Both frontend dan backend harus HTTPS
- ⚠️ Backend harus include frontend domain di `CORS_ALLOWED_ORIGINS`

---

## Testing CORS Configuration

### 1. Check Browser DevTools

**Network Tab**:
1. Open DevTools → Network
2. Make API request
3. Check request headers:
   - ✅ `Cookie` header harus ada (jika authenticated)
   - ✅ `Origin` header harus sesuai frontend domain
4. Check response headers:
   - ✅ `Access-Control-Allow-Origin` harus sesuai frontend domain
   - ✅ `Access-Control-Allow-Credentials: true`
   - ✅ `Set-Cookie` header (jika login/refresh)

**Application Tab**:
1. Open DevTools → Application → Cookies
2. Verify cookies ter-set dengan domain yang benar
3. Check flags:
   - ✅ `Secure` (production only)
   - ✅ `HttpOnly`
   - ✅ `SameSite` (Strict atau None)

### 2. Check Console Errors

**Common CORS Errors**:

```
❌ Access to XMLHttpRequest blocked by CORS policy
   → Backend tidak include frontend domain di CORS_ALLOWED_ORIGINS

❌ Credentials flag is 'true', but 'Access-Control-Allow-Credentials' header is ''
   → Backend tidak set Access-Control-Allow-Credentials: true

❌ Cookie was rejected because SameSite=None requires Secure
   → Backend set SameSite=None tapi Secure=false (atau HTTP)
```

### 3. Verify CSP

Check CSP `connect-src` directive:

```bash
curl -I https://sebarulang.com

# Should see:
# Content-Security-Policy: ... connect-src 'self' https://api.sebarulang.com ...
```

---

## Troubleshooting

### Problem: CORS Error di Browser Console

**Solution**:
1. Verify `CORS_ALLOWED_ORIGINS` di backend include frontend domain
2. Verify `Access-Control-Allow-Credentials: true` di backend
3. Verify `withCredentials: true` di frontend (sudah ada)

### Problem: Cookies Tidak Ter-Set

**Solution**:
1. Check `SameSite=None` dengan `Secure=true` (untuk cross-domain)
2. Check `COOKIE_SECURE=true` di backend (production)
3. Verify both frontend dan backend menggunakan HTTPS (production)

### Problem: Cookies Tidak Ter-Kirim

**Solution**:
1. Verify `withCredentials: true` di semua API calls (sudah ada)
2. Check `Access-Control-Allow-Credentials: true` di backend
3. Verify cookie domain dan path sudah benar

### Problem: CSP Blocking API Requests

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` sudah di-set dengan benar
2. Check `connect-src` directive di CSP include backend URL
3. Verify format URL benar (dengan atau tanpa trailing slash)

---

## Checklist untuk Production

- [ ] Backend `CORS_ALLOWED_ORIGINS` include frontend domain
- [ ] Backend `Access-Control-Allow-Credentials: true`
- [ ] Backend `COOKIE_SECURE=true` (production)
- [ ] Backend `COOKIE_SAME_SITE=None` (untuk cross-domain) atau `Strict` (untuk subdomain)
- [ ] Frontend `NEXT_PUBLIC_API_URL` pointing ke production backend
- [ ] Frontend `withCredentials: true` (sudah ada)
- [ ] CSP `connect-src` include backend URL (sudah ada)
- [ ] Both frontend dan backend menggunakan HTTPS
- [ ] Test cookies ter-set dan ter-kirim
- [ ] Test API requests berhasil tanpa CORS errors

---

## Best Practices

1. **Use Subdomain** (Recommended):
   - Frontend: `sebarulang.com`
   - Backend: `api.sebarulang.com`
   - Benefits: `SameSite=Strict`, shared cookies, more secure

2. **Always Use HTTPS** (Production):
   - Required untuk `SameSite=None` dengan `Secure=true`
   - Required untuk secure cookies

3. **Minimal CORS Origins**:
   - Hanya include domains yang benar-benar diperlukan
   - Jangan gunakan wildcard `*` dengan credentials

4. **Test Thoroughly**:
   - Test di development dan production
   - Test dengan different browsers
   - Test cookie expiration dan refresh

---

## Summary

**Frontend sudah dikonfigurasi dengan benar**:
- ✅ `withCredentials: true` di API client
- ✅ CSP `connect-src` include backend URL

**Backend perlu dikonfigurasi**:
- ⚠️ Set `CORS_ALLOWED_ORIGINS` dengan frontend domain
- ⚠️ Set `Access-Control-Allow-Credentials: true`
- ⚠️ Set cookie configuration sesuai scenario (SameSite, Secure, Domain)

**Environment Variables**:
- Frontend: `NEXT_PUBLIC_API_URL` (sudah ada)
- Backend: `CORS_ALLOWED_ORIGINS`, `COOKIE_SECURE`, `COOKIE_SAME_SITE`, `COOKIE_DOMAIN`

Jika masih ada masalah, check browser console untuk error messages spesifik.

