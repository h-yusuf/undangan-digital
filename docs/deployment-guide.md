# 🚀 Deployment Guide

Panduan deploy semua services ke production.

---

## 📋 Prerequisites

1. **Akun yang dibutuhkan:**
   - [Netlify](https://netlify.com) - untuk Client & Admin
   - [Cloudflare](https://cloudflare.com) - untuk Server API
   - [Supabase](https://supabase.com) - Database (sudah ada)

2. **Install CLI tools:**
   ```bash
   npm install -g wrangler netlify-cli
   ```

---

## 1️⃣ Deploy Server (Cloudflare Workers)

### Setup Cloudflare Account
```bash
cd server
wrangler login
```

### Set Production Secrets
```bash
# Set Supabase credentials sebagai secrets
wrangler secret put SUPABASE_URL
# Paste: https://your-project.supabase.co

wrangler secret put SUPABASE_ANON_KEY
# Paste: your_anon_key

wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Paste: your_service_role_key
```

### Deploy
```bash
npm run deploy
# atau
wrangler deploy
```

### Verify
- URL akan muncul: `https://undangan-digital-api.your-subdomain.workers.dev`
- Test: `curl https://undangan-digital-api.your-subdomain.workers.dev/`
- Harusnya return JSON dengan endpoints list

---

## 2️⃣ Deploy Client (Netlify)

### Setup
```bash
cd client
netlify login
netlify init
```

### Configure Environment Variables
Di Netlify Dashboard → Site Settings → Environment Variables, tambahkan:
```
PUBLIC_API_URL=https://undangan-digital-api.your-subdomain.workers.dev
```

### Deploy
```bash
npm run build
netlify deploy --prod
```

Atau via Git:
1. Push repo ke GitHub
2. Connect repo di Netlify Dashboard
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy otomatis setiap push

### Custom Domain (Optional)
- Netlify Dashboard → Domain Settings
- Add custom domain: `undangan.yourdomain.com`
- Update DNS sesuai instruksi Netlify

---

## 3️⃣ Deploy Admin (Netlify)

### Setup
```bash
cd admin
netlify init
```

### Configure Environment Variables
Di Netlify Dashboard → Site Settings → Environment Variables:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=https://undangan-digital-api.your-subdomain.workers.dev
```

### Deploy
```bash
npm run build
netlify deploy --prod
```

### Custom Domain (Optional)
- Subdomain: `admin.yourdomain.com`

---

## 4️⃣ Supabase Production Setup

### Database
- Schema sudah di-setup via `docs/schema.sql`
- Pastikan RLS policies aktif
- Verify indexes untuk performance

### API Keys
- **Anon Key**: untuk client & admin (public-safe)
- **Service Role Key**: hanya untuk server (rahasia!)

### CORS Settings
Di Supabase Dashboard → Settings → API:
- Allowed origins:
  - `https://your-client-domain.netlify.app`
  - `https://your-admin-domain.netlify.app`
  - `https://undangan-digital-api.your-subdomain.workers.dev`

---

## 5️⃣ Post-Deployment Checklist

### ✅ Server (Cloudflare Workers)
- [ ] API endpoint accessible
- [ ] Secrets configured
- [ ] CORS working
- [ ] Test all routes: `/event/:slug`, `/guest`, `/rsvp`

### ✅ Client (Netlify)
- [ ] Site loads
- [ ] Environment variables set
- [ ] Dynamic routes working: `/event-slug?to=Name`
- [ ] RSVP form submits successfully
- [ ] Custom domain configured (optional)

### ✅ Admin (Netlify)
- [ ] Dashboard loads
- [ ] Can view events & guests
- [ ] Can add new guests
- [ ] Copy link feature works
- [ ] Supabase connection working

### ✅ Database (Supabase)
- [ ] Tables exist with data
- [ ] RLS policies active
- [ ] Indexes created
- [ ] Production credentials secured

---

## 🔧 Troubleshooting

### CORS Errors
- Check Cloudflare Workers CORS headers di `server/src/index.ts`
- Verify allowed origins di Supabase settings

### Environment Variables Not Working
- Netlify: Rebuild site setelah set env vars
- Cloudflare: Use `wrangler secret` bukan env vars biasa

### 404 on Dynamic Routes
- Check `netlify.toml` redirects configuration
- Ensure `publish = "dist"` correct

### Database Connection Failed
- Verify Supabase URL & keys
- Check RLS policies tidak terlalu restrictive
- Test connection via Supabase SQL editor

---

## 📊 Monitoring

### Cloudflare Workers
- Dashboard → Workers → Analytics
- Monitor requests, errors, CPU time

### Netlify
- Site Dashboard → Analytics
- Monitor bandwidth, build times

### Supabase
- Dashboard → Database → Usage
- Monitor connections, queries

---

## 🔄 CI/CD (Optional)

### GitHub Actions untuk Auto-Deploy

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-server:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd server && npm install
      - run: cd server && npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}

  deploy-client:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd client && npm install && npm run build
      - uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod --dir=client/dist
```

---

## 🎯 Production URLs

Setelah deploy, catat URLs:

- **Client**: `https://your-site.netlify.app`
- **Admin**: `https://your-admin.netlify.app`
- **API**: `https://undangan-digital-api.your-subdomain.workers.dev`
- **Database**: `https://your-project.supabase.co`

Update semua environment variables dengan production URLs!

---

## 🔐 Security Notes

1. **NEVER** commit `.env` files
2. Service role key hanya di server
3. Enable rate limiting di Cloudflare
4. Regular backup database via Supabase
5. Monitor error logs regularly

---

Deployment selesai! 🎉
