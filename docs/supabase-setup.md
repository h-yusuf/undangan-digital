# Supabase Setup Guide

## 1. Create Supabase Project

1. Buka [https://supabase.com](https://supabase.com)
2. Sign in / Sign up
3. Create new project
4. Tunggu project selesai dibuat

## 2. Run SQL Schema

1. Buka **SQL Editor** di Supabase Dashboard
2. Copy semua isi dari `docs/schema.sql`
3. Paste ke SQL Editor
4. Klik **Run** untuk execute

## 3. Get API Credentials

1. Buka **Settings** → **API**
2. Copy credentials berikut:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

## 4. Setup Environment Variables

### Server (Backend)

Copy `.dev.vars.example` ke `.dev.vars`:

```bash
cd server
cp .dev.vars.example .dev.vars
```

Isi dengan credentials dari Supabase:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Client (Frontend)

Copy `.env.example` ke `.env`:

```bash
cd client
cp .env.example .env
```

Isi dengan:

```
PUBLIC_API_URL=http://localhost:8787
```

## 5. Verify Database

1. Buka **Table Editor** di Supabase Dashboard
2. Pastikan table berikut sudah ada:
   - `events`
   - `guests`
   - `rsvp`

## 6. Test Sample Data

Jika kamu run SQL schema dengan sample data, coba query:

```sql
SELECT * FROM events;
SELECT * FROM guests;
```

Seharusnya ada 1 event dan 2 guests.

## Database Structure

```
events (id, slug, title, date, location, description, image_url)
  ↓
guests (id, event_id, name, phone, email)
  ↓
rsvp (id, guest_id, status, message)
```

## Security (RLS)

- ✅ Public read untuk semua table
- ✅ Public insert/update untuk RSVP
- ⚠️ Admin operations butuh service_role key (backend only)
