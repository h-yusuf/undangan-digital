# 🚀 Roadmap Development - Event Platform (Tailwind + shadcn)

## 🎯 Goal
Membangun platform event / undangan digital dengan stack:

- Frontend: Astro + Tailwind + Netlify
- Backend: Hono + Cloudflare Workers
- Database: Supabase
- CMS/Admin: shadcn/ui (React-based)

---

# 🧩 PHASE 1 — FUNDAMENTAL SETUP

## ✅ Objective
Setup semua core project

### Tasks
- [ ] Setup monorepo:
  - /client (Astro)
  - /server (Hono)
  - /admin (React + shadcn)

- [ ] Install Tailwind di Astro
- [ ] Setup Hono project
- [ ] Setup Supabase project
- [ ] Setup env variables

### Output
- Semua app bisa jalan lokal

---

# 🎨 PHASE 2 — UI FOUNDATION (Tailwind)

## ✅ Objective
Membangun design system

### Tasks
- [ ] Install Tailwind CSS di Astro
- [ ] Setup base styles (font, color, spacing)
- [ ] Buat utility class global
- [ ] Setup layout (container, grid)

### Output
- UI konsisten & reusable

---

# 🧱 PHASE 3 — DATABASE DESIGN

## ✅ Objective
Struktur data scalable

### Tasks
- [ ] Create table: events
- [ ] Create table: guests
- [ ] Create table: rsvp
- [ ] Add index (slug, event_id)
- [ ] Setup relationship

### Output
- DB siap production

---

# ⚙️ PHASE 4 — BACKEND CORE (Hono)

## ✅ Objective
API utama

### Tasks
- [ ] Setup route:
  - GET /event/:slug
  - POST /guest
  - POST /rsvp

- [ ] Integrasi Supabase
- [ ] Standard response format

### Output
- API ready

---

# 📦 PHASE 5 — FRONTEND CORE (Astro)

## ✅ Objective
Render event page

### Tasks
- [ ] Dynamic route [slug].astro
- [ ] Fetch API backend
- [ ] Handle query param (?to)
- [ ] Render data event

### Output
- Event page live

---

# 🧩 PHASE 6 — TEMPLATE SYSTEM

## ✅ Objective
Reusable UI

### Tasks
- [ ] Buat komponen:
  - Hero
  - Event Info
  - Gallery
  - Guest Name

- [ ] Gunakan Tailwind template
- [ ] Buat minimal 1 theme

### Output
- Template siap reuse

---

# 📩 PHASE 7 — RSVP SYSTEM

## ✅ Objective
User interaction

### Tasks
- [ ] Form RSVP (React island di Astro)
- [ ] POST ke backend
- [ ] Save ke Supabase

### Output
- RSVP aktif

---

# 🧑‍💻 PHASE 8 — CMS / ADMIN (shadcn)

## ✅ Objective
Dashboard admin untuk manage event

### Stack
- React (Vite / Next optional)
- shadcn/ui
- Tailwind

---

### Tasks

#### 🔐 Auth
- [ ] Login dengan Supabase Auth

#### 📊 Dashboard
- [ ] List events
- [ ] Create event
- [ ] Edit event

#### 👥 Guest Management
- [ ] Tambah guest
- [ ] List guest
- [ ] Generate link (?to=Nama)

#### 📩 RSVP Monitor
- [ ] List RSVP
- [ ] Filter status

---

### Output
- CMS internal siap dipakai

---

# 🔗 PHASE 9 — GUEST LINK SYSTEM

## ✅ Objective
Personalized invitation

### Tasks
- [ ] Generate URL:
  /event-slug?to=Nama

- [ ] Copy/share button
- [ ] Optional: shorten link

### Output
- Undangan personal

---

# ☁️ PHASE 10 — DEPLOYMENT

## ✅ Objective
Deploy semua service

### Tasks
- [ ] Deploy Astro → Netlify
- [ ] Deploy Hono → Cloudflare Workers
- [ ] Deploy Admin → Netlify / Vercel
- [ ] Setup Supabase production

### Output
- Semua live

---

# ⚡ PHASE 11 — OPTIMIZATION

## ✅ Objective
Performance

### Tasks
- [ ] Optimize Tailwind (purge CSS)
- [ ] Image compression
- [ ] Lazy loading
- [ ] API caching

---

# 🔐 PHASE 12 — SECURITY

## ✅ Objective
Keamanan

### Tasks
- [ ] Protect API key
- [ ] Input validation
- [ ] Rate limit (Cloudflare)
- [ ] Auth middleware

---

# 🚀 PHASE 13 — ADVANCED FEATURES

## ✅ Objective
Scaling product

### Tasks
- [ ] QR Code check-in
- [ ] WhatsApp blast
- [ ] Analytics dashboard
- [ ] Multi-template marketplace

---

# 🧠 FINAL PRODUCT

- Multi-event platform
- Template-based system
- Admin dashboard
- Scalable architecture

---

# 📌 NOTES

- Tailwind untuk speed UI
- shadcn untuk CMS (clean + modern)
- fokus MVP dulu

---

# 🔥 MVP TARGET

Stop di:
- Phase 1–7 + basic CMS

👉 sudah bisa:
- create event
- share link
- RSVP

👉 itu sudah bisa dijual