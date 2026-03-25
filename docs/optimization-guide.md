# ⚡ Optimization Guide

Panduan optimasi performance untuk production.

---

## 🎨 Frontend Optimization (Client & Admin)

### 1. Tailwind CSS Purge
Tailwind otomatis purge unused CSS saat build production.

**Verify purge config di `tailwind.config.mjs`:**
```js
content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}']
```

### 2. Image Optimization

**Best practices:**
- Gunakan format modern: WebP, AVIF
- Lazy loading untuk images
- Responsive images dengan srcset
- Compress images sebelum upload

**Tools:**
```bash
# Install sharp untuk image processing
npm install sharp

# Atau gunakan online tools:
# - TinyPNG (https://tinypng.com)
# - Squoosh (https://squoosh.app)
```

**Astro Image component:**
```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<Image 
  src={heroImage} 
  alt="Hero" 
  width={1200} 
  height={600}
  loading="lazy"
  format="webp"
/>
```

### 3. Font Optimization

**Preload critical fonts di `BaseLayout.astro`:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap">
```

**Atau self-host fonts:**
```bash
# Download fonts dan taruh di public/fonts/
# Update CSS untuk load local fonts
```

### 4. Code Splitting

Astro config sudah include:
```js
vite: {
  build: {
    cssCodeSplit: true,
    minify: 'esbuild',
  },
}
```

### 5. Bundle Size Analysis

```bash
cd client
npm run build

# Check bundle size
npx vite-bundle-visualizer
```

---

## 🚀 Backend Optimization (Server)

### 1. Response Compression
Sudah aktif via `compress()` middleware di Hono.

### 2. API Caching

**Event data (jarang berubah):**
```ts
app.use('/event/*', cacheMiddleware(600)) // 10 menit
```

**Guest/RSVP (sering berubah):**
```ts
app.use('/rsvp/*', noCacheMiddleware)
```

### 3. Database Query Optimization

**Indexes sudah dibuat di schema.sql:**
```sql
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_guests_event_id ON guests(event_id);
CREATE INDEX idx_rsvp_guest_id ON rsvp(guest_id);
```

**Best practices:**
- Select hanya kolom yang dibutuhkan
- Gunakan `.single()` untuk single row
- Batch queries jika perlu multiple data

### 4. Cloudflare Workers Optimization

**KV Storage untuk caching (optional):**
```toml
# wrangler.toml
[[kv_namespaces]]
binding = "CACHE"
id = "your_kv_namespace_id"
```

```ts
// Cache event data di KV
const cached = await c.env.CACHE.get(`event:${slug}`);
if (cached) return c.json(JSON.parse(cached));

// Fetch from DB
const event = await getEvent(slug);

// Store in KV (1 hour TTL)
await c.env.CACHE.put(`event:${slug}`, JSON.stringify(event), {
  expirationTtl: 3600,
});
```

---

## 📊 Database Optimization (Supabase)

### 1. Connection Pooling
Supabase otomatis handle connection pooling.

### 2. Query Performance

**Monitor slow queries:**
- Supabase Dashboard → Database → Query Performance
- Identify slow queries
- Add indexes jika perlu

**Example: Add index untuk search by name:**
```sql
CREATE INDEX idx_guests_name ON guests USING gin(name gin_trgm_ops);
```

### 3. Row Level Security (RLS)

RLS policies sudah optimal:
- Public read untuk events
- Authenticated write untuk guests/rsvp
- Admin-only untuk sensitive operations

### 4. Database Backups

Enable automatic backups:
- Supabase Dashboard → Database → Backups
- Set daily backups
- Retention: 7 days minimum

---

## 🌐 CDN & Edge Optimization

### 1. Netlify Edge Functions (Optional)

Deploy API routes ke edge untuk latency rendah:

```ts
// netlify/edge-functions/event.ts
export default async (request: Request) => {
  const url = new URL(request.url);
  const slug = url.pathname.split('/').pop();
  
  // Fetch from origin API
  const response = await fetch(`https://api.yourdomain.com/event/${slug}`);
  
  return response;
};
```

### 2. Cloudflare CDN

Cloudflare Workers otomatis di-cache di edge network.

**Custom cache rules:**
```ts
// Set cache headers
c.header('Cache-Control', 'public, max-age=600, s-maxage=3600');
c.header('CDN-Cache-Control', 'max-age=3600');
```

---

## 📈 Performance Metrics

### Target Metrics

**Lighthouse Score:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

**Core Web Vitals:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**API Response Time:**
- GET /event/:slug: < 200ms
- POST /rsvp: < 300ms

### Monitoring Tools

1. **Google PageSpeed Insights**
   - https://pagespeed.web.dev/

2. **WebPageTest**
   - https://www.webpagetest.org/

3. **Cloudflare Analytics**
   - Workers Dashboard → Analytics

4. **Supabase Metrics**
   - Dashboard → Database → Usage

---

## 🔧 Build Optimization

### Client Build

```bash
cd client
npm run build

# Output analysis
ls -lh dist/
```

**Expected sizes:**
- HTML: < 50KB per page
- CSS: < 100KB (after purge)
- JS: < 200KB total

### Admin Build

```bash
cd admin
npm run build

# Check bundle
npx vite-bundle-visualizer
```

**Optimization tips:**
- Code split per route
- Lazy load heavy components
- Tree-shake unused dependencies

---

## 🎯 Checklist

### ✅ Frontend
- [ ] Tailwind purge aktif
- [ ] Images compressed & lazy loaded
- [ ] Fonts optimized (preload/self-host)
- [ ] Code splitting enabled
- [ ] Bundle size < 500KB
- [ ] Lighthouse score > 90

### ✅ Backend
- [ ] Response compression aktif
- [ ] Cache headers configured
- [ ] Database indexes created
- [ ] Query performance monitored
- [ ] API response time < 300ms

### ✅ Database
- [ ] Indexes untuk semua foreign keys
- [ ] RLS policies optimal
- [ ] Backups enabled
- [ ] Connection pooling configured

### ✅ CDN
- [ ] Static assets di CDN
- [ ] Cache headers correct
- [ ] Edge caching enabled
- [ ] GZIP/Brotli compression

---

## 🚀 Advanced Optimizations (Optional)

### 1. Service Worker untuk Offline Support

```js
// public/sw.js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

### 2. Prefetch Critical Resources

```html
<link rel="prefetch" href="/api/event/pernikahan-fulan-fulana">
```

### 3. HTTP/2 Server Push (Netlify)

```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Link = "</styles/global.css>; rel=preload; as=style"
```

### 4. Database Read Replicas (Supabase Pro)

Untuk high-traffic apps, gunakan read replicas untuk distribute load.

---

## 📊 Performance Testing

### Load Testing

```bash
# Install k6
brew install k6

# Run load test
k6 run loadtest.js
```

**loadtest.js:**
```js
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 100,
  duration: '30s',
};

export default function () {
  let res = http.get('https://api.yourdomain.com/event/test-event');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

---

Optimization selesai! Performance siap production. 🚀
