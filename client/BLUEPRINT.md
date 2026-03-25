# 📦 Frontend Architecture (Astro + React CMS)

## 🎯 Goal
Frontend terbagi menjadi 2 bagian:

1. Public Site (Astro)
   - Landing page event
   - Undangan digital
   - Akses oleh tamu

2. Admin CMS (React + shadcn)
   - Dashboard admin
   - Manage event & guest
   - Internal use

---

# 🧩 OVERVIEW ARCHITECTURE

Public (User)
→ Astro (Netlify)

Admin (Internal)
→ React + shadcn (Netlify / Vercel)

Backend API
→ Hono (Cloudflare Workers)

Database
→ Supabase

---

# 🌐 1. PUBLIC FRONTEND (Astro)

## 🎯 Responsibility
- Render halaman event
- Handle URL parameter (?to=Nama)
- Display data event & guest
- UI ringan & cepat

---

## 🧱 Tech Stack
- Astro
- Tailwind CSS
- Fetch API

---

## 📁 Folder Structure

frontend/
├── src/
│   ├── pages/
│   │   ├── [slug].astro
│   │   └── index.astro
│   │
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── EventInfo.astro
│   │   ├── Gallery.astro
│   │   ├── GuestName.astro
│   │   └── RSVPForm.jsx   # React island
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro
│   │
│   ├── lib/
│   │   └── api.ts
│   │
│   └── styles/

---

## 🔗 Routing

Dynamic:
- /[slug]?to=Nama

Example:
- /ade-andhika?to=Desi

---

## 🧠 Data Flow

1. User buka URL
2. Astro ambil:
   - slug
   - query param (?to)

3. Fetch ke backend:
   GET /event/:slug

4. Render:
   - event data
   - guest name

---

## 🔑 Query Param Handling

const url = new URL(Astro.request.url)
const guest = url.searchParams.get('to')

---

## ⚡ Optimization

- Static rendering (SSG)
- Lazy load image
- Minimal JS (Astro default)
- Tailwind purge

---

## 📦 Deployment

- Netlify
- build: npm run build
- output: dist

---

# 🧑‍💻 2. ADMIN CMS (React + shadcn)

## 🎯 Responsibility
- Manage event
- Manage guest
- Generate invitation link
- Monitor RSVP

---

## 🧱 Tech Stack
- React (Vite / Next.js optional)
- Tailwind CSS
- shadcn/ui
- Supabase client

---

## 📁 Folder Structure

admin/
├── src/
│   ├── pages/
│   │   ├── dashboard.jsx
│   │   ├── events.jsx
│   │   ├── event-detail.jsx
│   │   └── guests.jsx
│   │
│   ├── components/
│   │   ├── ui/          # shadcn components
│   │   ├── EventForm.jsx
│   │   ├── GuestTable.jsx
│   │   └── RSVPList.jsx
│   │
│   ├── lib/
│   │   ├── supabase.js
│   │   └── api.js
│   │
│   └── hooks/

---

## 🔐 Auth

- Supabase Auth
- Login admin

---

## 🧠 Data Flow

1. Admin login
2. Fetch data:
   - events
   - guests
   - rsvp

3. CRUD via API:
   - create event
   - add guest
   - update RSVP

---

## 🔗 API Integration

- GET /event
- POST /event
- POST /guest
- POST /rsvp

---

## 🔗 Generate Link

Format:
- /event-slug?to=Nama

---

## 📦 Deployment

- Netlify / Vercel

---

# 🔄 SHARED LOGIC

## API Helper

frontend & admin pakai:

lib/api.ts

- fetch event
- post rsvp
- create guest

---

# 🧠 DESIGN PRINCIPLES

## 1. Separation of Concern
- Astro → public
- React → admin

## 2. Performance First
- public site harus ringan

## 3. Scalability
- admin bisa berkembang tanpa ganggu public

---

# 🚀 FUTURE IMPROVEMENT

- multi-template system
- theme switcher
- multi-tenant CMS
- analytics dashboard

---

# 📌 NOTES

- Astro tidak digunakan untuk CMS
- React + shadcn khusus admin
- gunakan Tailwind untuk consistency

---

# 🔥 FINAL SUMMARY

Public:
→ Astro (fast, static, SEO friendly)

Admin:
→ React + shadcn (interactive, powerful)

Backend:
→ Hono API

Database:
→ Supabase