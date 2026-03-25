# 💌 Undangan Digital Platform

Platform undangan digital modern dengan Astro, Hono, dan Supabase.

## 🏗️ Project Structure

```
undangan-digital/
├── client/          # Frontend (Astro + Tailwind)
├── server/          # Backend API (Hono + Cloudflare Workers)
├── admin/           # CMS Admin (React + shadcn) - Coming soon
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

## 📖 Documentation

- [Roadmap](./ROADMAP.md) - Development roadmap & phases
- [Server Blueprint](./server/BLUEPRINT.md) - Backend architecture
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
