# Backend Architecture (Hono + Cloudflare Workers)

## 🎯 Goal
Backend bertugas untuk:
- Menyediakan API event & guest
- Handle RSVP
- Generate link undangan
- Integrasi dengan Supabase

---

## 🧱 Tech Stack
- Hono (web framework)
- Cloudflare Workers (runtime)
- Supabase (database)

---

## 📁 Folder Structure

backend/
├── src/
│   ├── index.ts            # entry point
│   ├── routes/
│   │   ├── event.ts
│   │   ├── guest.ts
│   │   └── rsvp.ts
│   │
│   ├── services/
│   │   └── supabase.ts
│   │
│   └── utils/
│       └── response.ts
│
├── wrangler.toml
└── package.json

---

## 🔗 API Routes

GET    /event/:slug
GET    /guest/:id
POST   /rsvp
POST   /guest

---

## 🧠 Data Flow

1. Request dari frontend
2. Hono route handler
3. Query ke Supabase
4. Return JSON response

---

## 🔌 Supabase Client

services/supabase.ts

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
)

---

## 📦 Example Route

routes/event.ts

app.get('/event/:slug', async (c) => {
  const slug = c.req.param('slug')

  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()

  return c.json(data)
})

---

## 📩 RSVP Endpoint

POST /rsvp

Body:
{
  "guest_id": "...",
  "status": "hadir"
}

---

## 🔐 Security

- gunakan anon key (frontend)
- gunakan service role key hanya di backend
- validasi input

---

## ⚡ Performance

- Cloudflare edge (low latency)
- minimal cold start
- caching bisa ditambahkan

---

## 🚀 Deployment

npx wrangler deploy

---

## 🔥 Future Features

- generate QR code
- WhatsApp integration
- analytics tracking