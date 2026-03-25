# Server (Hono + Cloudflare Workers)

Backend API untuk undangan digital platform.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Server akan berjalan di `http://localhost:8787`

## Deploy

```bash
npm run deploy
```

## Environment Variables

Copy `.dev.vars.example` ke `.dev.vars`:

```bash
cp .dev.vars.example .dev.vars
```

Isi dengan credentials Supabase:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
