# 💌 Undangan Digital Platform

Platform undangan digital modern dengan Astro, Hono, dan Supabase.

## ✨ Features

✅ **Phase 1-13 Complete!**

- 🎨 Dynamic event pages dengan Tailwind CSS
- 👥 Guest management system
- 📩 RSVP system dengan status tracking
- 🔗 Personalized invitation links
- 📊 Analytics dashboard
- 🔐 Security (validation, rate limiting, auth)
- ⚡ Performance optimization
- 📱 QR code check-in system
- 💬 WhatsApp blast integration (ready)
- 🚀 Production-ready deployment configs

## 🏗️ Project Structure

```
undangan-digital/
├── client/          # Frontend (Astro + Tailwind)
├── server/          # Backend API (Hono + Cloudflare Workers)
├── admin/           # CMS Admin (React + Vite + Tailwind)
└── docs/            # Documentation & SQL schema
```

## 🚀 Quick Start

### 1. Setup Supabase

1. Buat project di [Supabase](https://supabase.com)
2. Run SQL schema dari `docs/schema.sql` di SQL Editor
3. Copy API credentials (URL, anon key, service role key)

### 2. Setup Server (Backend)

```bash
cd server
npm install
cp .dev.vars.example .dev.vars
# Edit .dev.vars dengan Supabase credentials
npm run dev
```

Server akan berjalan di `http://localhost:8787`

### 3. Setup Client (Frontend)

```bash
cd client
npm install
cp .env.example .env
# Edit .env jika perlu (default sudah OK)
npm run dev
```

Client akan berjalan di `http://localhost:4321`

### 4. Setup Admin (CMS Dashboard)

```bash
cd admin
npm install
cp .env.example .env
# Edit .env dengan Supabase credentials & API URL
npm run dev
```

Admin akan berjalan di `http://localhost:3000`

## �️ Tech Stack

### Frontend
- **Astro** - Static site generator
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

### Admin
- **React** - UI framework
- **Vite** - Build tool
- **React Router** - Routing
- **TanStack Query** - Data fetching
- **Tailwind CSS** - Styling

### Backend
- **Hono** - Web framework
- **Cloudflare Workers** - Serverless runtime
- **TypeScript** - Type safety

### Database
- **Supabase** - PostgreSQL database
- **Row Level Security** - Data protection

## 📡 API Endpoints

### Events
- `GET /event/:slug` - Get event by slug

### Guests
- `GET /guest/:id` - Get guest by ID
- `POST /guest` - Create new guest
- `GET /guest/find?event_id=xxx&name=xxx` - Find guest by name
- `GET /guest/event/:event_id` - Get all guests for event

### RSVP
- `POST /rsvp` - Submit RSVP
- `GET /rsvp/guest/:guest_id` - Get RSVP by guest
- `GET /rsvp/event/:event_id` - Get all RSVPs for event

### Analytics
- `GET /analytics/event/:event_id` - Get event analytics
- `GET /analytics/dashboard` - Get dashboard stats

### Check-in (Optional)
- `POST /checkin` - Record check-in
- `GET /checkin/event/:event_id` - Get check-ins for event

## �📖 Documentation

### Core Docs
- [Roadmap](./ROADMAP.md) - Development roadmap & phases
- [Server Blueprint](./server/BLUEPRINT.md) - Backend architecture
- [Client Blueprint](./client/BLUEPRINT.md) - Frontend architecture

### Deployment & Production
- [Deployment Guide](./docs/deployment-guide.md) - Deploy ke Netlify & Cloudflare
- [Optimization Guide](./docs/optimization-guide.md) - Performance optimization
- [Security Guide](./docs/security-guide.md) - Security best practices

### Advanced Features
- [Advanced Features](./docs/advanced-features.md) - QR, WhatsApp, Analytics, etc.
- [Supabase Setup](./docs/supabase-setup.md) - Database setup guide
- [Client Blueprint](./client/BLUEPRINT.md) - Frontend architecture
- [Supabase Setup](./docs/supabase-setup.md) - Database setup guide
- [Database Schema](./docs/schema.sql) - SQL schema

## 🎯 Features (Phase 1-6 MVP)

- ✅ Dynamic event pages dengan slug
- ✅ Personalized invitation dengan query param `?to=Nama`
- ✅ Event info display (date, time, location)
- ✅ RSVP system (hadir/tidak hadir)
- ✅ Tailwind CSS design system
- ✅ Reusable component system
- ✅ REST API dengan Hono
- ✅ Supabase integration

## 🔗 API Endpoints

- `GET /event/:slug` - Get event by slug
- `GET /guest/:id` - Get guest by ID
- `POST /guest` - Create new guest
- `POST /rsvp` - Submit RSVP
- `GET /rsvp/guest/:guest_id` - Get RSVP by guest
- `GET /rsvp/event/:event_id` - Get all RSVPs for event

## 🧪 Testing

Setelah setup, test dengan sample data:

1. Buka `http://localhost:4321/pernikahan-ade-desi`
2. Atau dengan guest name: `http://localhost:4321/pernikahan-ade-desi?to=Budi`

## 📦 Tech Stack

- **Frontend**: Astro 4.x, Tailwind CSS 3.x
- **Backend**: Hono 4.x, Cloudflare Workers
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Netlify (frontend), Cloudflare (backend)

## 🛠️ Development

### Client Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Server Commands

```bash
npm run dev      # Start dev server with Wrangler
npm run deploy   # Deploy to Cloudflare Workers
```

## 📝 Next Steps (Phase 7+)

- [ ] Admin CMS dengan React + shadcn
- [ ] Guest management & link generation
- [ ] QR code check-in
- [ ] WhatsApp integration
- [ ] Analytics dashboard

## 📄 License

MIT
