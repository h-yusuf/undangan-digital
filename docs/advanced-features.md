# 🚀 Advanced Features Guide

Panduan implementasi fitur-fitur advanced.

---

## 📱 QR Code Check-In System

### Database Setup

```sql
-- Run schema-checkin.sql
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guest_id)
);
```

### Backend Implementation

**Generate QR Code:**
```bash
cd server
npm install qrcode
```

**API Endpoints:**
- `POST /checkin` - Record check-in
- `GET /checkin/event/:event_id` - Get all check-ins for event

### Frontend Integration

**Admin: Generate QR for Guest**
```tsx
import QRCode from 'qrcode';

const generateGuestQR = async (guestId: string, eventSlug: string) => {
  const checkInURL = `https://yourdomain.com/checkin?guest=${guestId}&event=${eventSlug}`;
  const qrDataURL = await QRCode.toDataURL(checkInURL);
  return qrDataURL;
};
```

**Mobile: Scan QR & Check-In**
```tsx
// Use library: react-qr-scanner or html5-qrcode
import { Html5QrcodeScanner } from 'html5-qrcode';

const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 });
scanner.render(onScanSuccess, onScanError);

function onScanSuccess(decodedText: string) {
  // Parse URL and extract guest_id
  // Call POST /checkin API
}
```

---

## 💬 WhatsApp Blast Integration

### Service Options

**1. Fonnte.com (Indonesia)**
```bash
# Setup
1. Register di fonnte.com
2. Get API token
3. Add to environment: FONNTE_API_TOKEN
```

**Send Message:**
```ts
async function sendWhatsApp(phone: string, message: string) {
  const response = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: {
      'Authorization': process.env.FONNTE_API_TOKEN,
    },
    body: JSON.stringify({
      target: phone,
      message: message,
    }),
  });
  
  return response.json();
}
```

**2. Twilio WhatsApp API**
```bash
npm install twilio
```

```ts
import twilio from 'twilio';

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

await client.messages.create({
  from: 'whatsapp:+14155238886',
  to: `whatsapp:${phone}`,
  body: message,
});
```

### Bulk Send Implementation

**Admin Feature:**
```tsx
// Send invitations to all guests
const sendBulkInvitations = async (eventId: string) => {
  const guests = await fetchGuests(eventId);
  const event = await fetchEvent(eventId);
  
  for (const guest of guests) {
    const inviteLink = generateInvitationLink(event.slug, guest.name);
    const message = generateInvitationMessage(
      guest.name,
      event.title,
      event.date,
      inviteLink
    );
    
    await sendWhatsApp(guest.phone, message);
    
    // Rate limit: wait 1 second between messages
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};
```

**Message Template:**
```
Halo {nama}! 👋

Anda diundang ke acara:
*{judul_event}*

📅 {tanggal}
📍 {lokasi}

Silakan buka undangan digital:
{link}

Mohon konfirmasi kehadiran Anda.

Terima kasih! 🙏
```

---

## 📊 Analytics Dashboard

### Metrics Tracked

1. **Guest Stats:**
   - Total guests
   - RSVP rate
   - Attendance confirmation

2. **Response Breakdown:**
   - Confirmed (hadir)
   - Declined (tidak_hadir)
   - Maybe (ragu)
   - No response

3. **Timeline:**
   - Recent RSVP activity
   - Check-in timeline

4. **Engagement:**
   - Link clicks (via UTM params)
   - Time to respond

### Implementation

**Backend Analytics Endpoint:**
```ts
// GET /analytics/event/:event_id
{
  total_guests: 100,
  rsvp_stats: {
    hadir: 75,
    tidak_hadir: 10,
    ragu: 5,
    belum_rsvp: 10
  },
  response_rate: 90,
  checkin_stats: {
    total: 60
  },
  recent_activity: [...]
}
```

**Frontend Visualization:**
```tsx
// Use recharts or chart.js
import { PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Hadir', value: 75, color: '#10b981' },
  { name: 'Tidak Hadir', value: 10, color: '#ef4444' },
  { name: 'Ragu', value: 5, color: '#f59e0b' },
  { name: 'Belum RSVP', value: 10, color: '#6b7280' },
];

<PieChart width={400} height={400}>
  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%">
    {data.map((entry, index) => (
      <Cell key={index} fill={entry.color} />
    ))}
  </Pie>
</PieChart>
```

---

## 🎨 Multi-Template System

### Template Structure

```
templates/
├── classic/
│   ├── Hero.astro
│   ├── EventInfo.astro
│   └── theme.css
├── modern/
│   ├── Hero.astro
│   ├── EventInfo.astro
│   └── theme.css
└── elegant/
    ├── Hero.astro
    ├── EventInfo.astro
    └── theme.css
```

### Database Schema

```sql
ALTER TABLE events ADD COLUMN template VARCHAR(50) DEFAULT 'classic';
ALTER TABLE events ADD COLUMN theme_config JSONB;

-- Example theme_config:
{
  "primaryColor": "#0ea5e9",
  "fontFamily": "Inter",
  "layout": "centered"
}
```

### Dynamic Template Loading

```astro
---
// [slug].astro
const { template } = event;

const Hero = await import(`../templates/${template}/Hero.astro`);
const EventInfo = await import(`../templates/${template}/EventInfo.astro`);
---

<Hero.default {...heroProps} />
<EventInfo.default {...eventProps} />
```

---

## 🔔 Reminder System

### Automated Reminders

**1. Email Reminders (via Supabase Edge Functions)**

```ts
// supabase/functions/send-reminders/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  // Get events happening in 7 days
  const upcomingEvents = await supabase
    .from('events')
    .select('*, guests(*)')
    .gte('date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
    .lte('date', new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString());

  for (const event of upcomingEvents) {
    for (const guest of event.guests) {
      // Send reminder email/WhatsApp
      await sendReminder(guest, event);
    }
  }

  return new Response('Reminders sent', { status: 200 });
});
```

**2. Schedule with Cron (Cloudflare Workers)**

```toml
# wrangler.toml
[triggers]
crons = ["0 9 * * *"]  # Daily at 9 AM
```

```ts
export default {
  async scheduled(event, env, ctx) {
    // Send daily reminders
    await sendDailyReminders(env);
  },
};
```

---

## 📸 Photo Gallery Integration

### Upload to Cloud Storage

**Cloudflare R2:**
```ts
// Upload photo
const upload = await env.R2_BUCKET.put(`events/${eventId}/${filename}`, file);

// Get public URL
const photoUrl = `https://cdn.yourdomain.com/events/${eventId}/${filename}`;
```

**Supabase Storage:**
```ts
const { data, error } = await supabase.storage
  .from('event-photos')
  .upload(`${eventId}/${filename}`, file);

const publicUrl = supabase.storage
  .from('event-photos')
  .getPublicUrl(`${eventId}/${filename}`).data.publicUrl;
```

### Gallery Component

```astro
---
const photos = await getEventPhotos(eventId);
---

<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
  {photos.map(photo => (
    <img 
      src={photo.url} 
      alt={photo.caption}
      loading="lazy"
      class="rounded-lg hover:scale-105 transition-transform cursor-pointer"
    />
  ))}
</div>
```

---

## 🎵 Music Player

### Background Music

```astro
<audio autoplay loop>
  <source src="/music/wedding-song.mp3" type="audio/mpeg">
</audio>

<button id="music-toggle" class="fixed bottom-4 right-4">
  🔊
</button>

<script>
  const audio = document.querySelector('audio');
  const toggle = document.getElementById('music-toggle');
  
  toggle?.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      toggle.textContent = '🔊';
    } else {
      audio.pause();
      toggle.textContent = '🔇';
    }
  });
</script>
```

---

## 💳 Payment Integration (Optional)

### Angpao Digital

**Midtrans Integration:**
```bash
npm install midtrans-client
```

```ts
import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

const transaction = await snap.createTransaction({
  transaction_details: {
    order_id: `angpao-${guestId}-${Date.now()}`,
    gross_amount: amount,
  },
  customer_details: {
    first_name: guestName,
    email: guestEmail,
  },
});

return transaction.redirect_url;
```

---

## 📱 Progressive Web App (PWA)

### Make it Installable

**manifest.json:**
```json
{
  "name": "Undangan Digital",
  "short_name": "Undangan",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0ea5e9",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Service Worker:**
```js
// public/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/styles/global.css',
        '/favicon.svg',
      ]);
    })
  );
});
```

---

## 🌍 Multi-Language Support

### i18n Setup

```ts
// src/i18n/index.ts
export const translations = {
  id: {
    rsvp: 'Konfirmasi Kehadiran',
    attending: 'Hadir',
    notAttending: 'Tidak Hadir',
  },
  en: {
    rsvp: 'RSVP',
    attending: 'Attending',
    notAttending: 'Not Attending',
  },
};

export function t(key: string, lang: string = 'id') {
  return translations[lang][key] || key;
}
```

---

Advanced features siap diimplementasikan! 🎉
