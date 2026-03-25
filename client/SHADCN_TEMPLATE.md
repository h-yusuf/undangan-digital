# Shadcn/UI Template Documentation

## Overview

Template undangan digital yang dibangun dengan **shadcn/ui design system** untuk Astro. Template ini menggunakan komponen-komponen yang konsisten, modern, dan mudah di-customize.

## Features

### ✨ **Shadcn/UI Components**
- **Button** - Berbagai variant (default, outline, secondary, ghost, link)
- **Card** - Card system dengan Header, Title, Content
- **Input** - Form inputs dengan styling konsisten
- **Badge** - Label dan tags
- Semua komponen menggunakan CSS variables untuk easy theming

### 🎨 **Customizable Background**
Background bisa di-customize melalui `theme` config di JSON:

```json
"theme": {
  "background_type": "gradient",  // gradient | solid | image
  "background_value": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "primary_color": "262.1 83.3% 57.8%",
  "radius": "0.5rem"
}
```

**Background Types:**

1. **Gradient**
   ```json
   "background_type": "gradient",
   "background_value": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
   ```

2. **Solid Color**
   ```json
   "background_type": "solid",
   "background_value": "#f0f0f0"
   ```

3. **Image**
   ```json
   "background_type": "image",
   "background_value": "https://images.unsplash.com/photo-1234567890"
   ```

### 🎯 **Design System**

Template menggunakan **CSS Variables** untuk theming:

```css
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--primary: 262.1 83.3% 57.8%;
--secondary: 210 40% 96.1%;
--muted: 210 40% 96.1%;
--accent: 210 40% 96.1%;
--card: 0 0% 100%;
--border: 214.3 31.8% 91.4%;
--radius: 0.5rem;
```

Semua warna menggunakan **HSL format** untuk easy manipulation.

### 📱 **Sections**

1. **Hero** - Full screen dengan countdown dan guest name
2. **Couple** - Foto dan info mempelai dengan Instagram links
3. **Event Details** - Akad & Resepsi dengan tanggal, waktu, lokasi
4. **Maps** - Google Maps embed dengan button "Open in Google Maps"
5. **Gallery** - Grid foto dengan hover overlay
6. **RSVP** - Form konfirmasi kehadiran dengan radio buttons
7. **Gift** - Amplop digital dengan copy account number
8. **Footer** - Thank you message

### 🎵 **Music Player**

Floating music player di top-right dengan play/pause toggle.

### 📍 **Bottom Navigation**

Fixed bottom navigation bar dengan 7 icons:
- Home
- Couple
- Event
- Maps
- Gallery
- Gift
- RSVP

## File Structure

```
client/src/
├── components/ui/          # Shadcn components
│   ├── Button.astro
│   ├── Card.astro
│   ├── CardHeader.astro
│   ├── CardTitle.astro
│   ├── CardContent.astro
│   ├── Input.astro
│   └── Badge.astro
├── lib/
│   └── utils.ts           # cn() utility for class merging
├── styles/
│   └── globals.css        # Shadcn CSS variables
├── pages/
│   └── shadcn.astro       # Main template
└── data/
    └── dummy-event.json   # Event data with theme config
```

## Usage

### 1. Access Template

```
http://localhost:4321/shadcn?to=NamaTamu
```

### 2. Customize Theme

Edit `dummy-event.json`:

```json
{
  "event": {
    "theme": {
      "background_type": "gradient",
      "background_value": "linear-gradient(to right, #ff6b6b, #4ecdc4)",
      "primary_color": "200 100% 50%",
      "radius": "0.75rem"
    }
  }
}
```

### 3. Change Colors

Edit `src/styles/globals.css`:

```css
:root {
  --primary: 200 100% 50%;  /* Change primary color */
  --radius: 0.75rem;        /* Change border radius */
}
```

## Component Examples

### Button

```astro
<Button variant="default" size="lg">
  Click Me
</Button>

<Button variant="outline">
  Outline Button
</Button>
```

### Card

```astro
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

### Input

```astro
<Input 
  type="text" 
  placeholder="Enter your name"
  class="max-w-sm"
/>
```

### Badge

```astro
<Badge variant="default">New</Badge>
<Badge variant="secondary">Featured</Badge>
```

## Customization Tips

### Change Primary Color

1. Convert your color to HSL (e.g., `#667eea` → `262.1 83.3% 57.8%`)
2. Update in `globals.css`:
   ```css
   --primary: 262.1 83.3% 57.8%;
   ```

### Change Border Radius

```css
--radius: 0.5rem;  /* Default */
--radius: 1rem;    /* More rounded */
--radius: 0.25rem; /* Less rounded */
```

### Dark Mode Support

Template sudah include dark mode variables. Tinggal tambahkan class `dark` ke `<html>`:

```astro
<html lang="id" class="dark">
```

## Benefits of Shadcn/UI

✅ **Consistent Design** - Semua komponen follow design system  
✅ **Easy Customization** - CSS variables untuk theming  
✅ **Type-Safe** - TypeScript support  
✅ **Accessible** - Built with accessibility in mind  
✅ **No Runtime** - Pure CSS, no JavaScript overhead  
✅ **Flexible** - Easy to modify dan extend  

## Next Steps

1. **CMS Integration** - Connect theme config ke Supabase
2. **Theme Presets** - Buat preset themes (romantic, elegant, modern, dll)
3. **Live Preview** - Admin panel untuk preview theme changes
4. **More Components** - Add Dialog, Dropdown, Tabs, dll
5. **Animation Library** - Add framer-motion atau similar

## Dependencies

```json
{
  "clsx": "^2.x",
  "tailwind-merge": "^2.x",
  "class-variance-authority": "^0.7.x"
}
```

## Support

Template ini fully customizable dan production-ready. Semua komponen sudah tested dan optimized untuk performance.
