-- ============================================
-- UNDANGAN DIGITAL - DATABASE SCHEMA
-- ============================================

-- Table: events
-- Menyimpan data event/undangan
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  location TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk slug (sering di-query)
CREATE INDEX idx_events_slug ON events(slug);

-- ============================================

-- Table: guests
-- Menyimpan data tamu undangan
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk event_id (relasi ke events)
CREATE INDEX idx_guests_event_id ON guests(event_id);

-- ============================================

-- Table: rsvp
-- Menyimpan konfirmasi kehadiran tamu
CREATE TABLE rsvp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('hadir', 'tidak_hadir', 'ragu')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk guest_id
CREATE INDEX idx_rsvp_guest_id ON rsvp(guest_id);

-- Constraint: satu guest hanya bisa RSVP sekali
CREATE UNIQUE INDEX idx_rsvp_unique_guest ON rsvp(guest_id);

-- ============================================

-- Function: Update timestamp otomatis
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk events
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk rsvp
CREATE TRIGGER update_rsvp_updated_at
  BEFORE UPDATE ON rsvp
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================

-- Row Level Security (RLS)
-- Enable RLS untuk semua table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;

-- Policy: Public read untuk events
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

-- Policy: Public read untuk guests
CREATE POLICY "Guests are viewable by everyone"
  ON guests FOR SELECT
  USING (true);

-- Policy: Public read untuk rsvp
CREATE POLICY "RSVP are viewable by everyone"
  ON rsvp FOR SELECT
  USING (true);

-- Policy: Public insert untuk rsvp (user bisa submit RSVP)
CREATE POLICY "Anyone can insert RSVP"
  ON rsvp FOR INSERT
  WITH CHECK (true);

-- Policy: Public update untuk rsvp (user bisa update RSVP mereka)
CREATE POLICY "Anyone can update RSVP"
  ON rsvp FOR UPDATE
  USING (true);

-- ============================================
-- SAMPLE DATA (Optional - untuk testing)
-- ============================================

-- Insert sample event
INSERT INTO events (slug, title, date, location, description)
VALUES (
  'pernikahan-fulan-fulana',
  'Pernikahan fulan dan fulana',
  '2024-12-25 14:00:00+07',
  'Gedung Serbaguna, Jakarta',
  'Kami mengundang Anda untuk merayakan hari bahagia kami'
);

-- Insert sample guests
INSERT INTO guests (event_id, name, phone)
SELECT 
  id,
  'Budi Santoso',
  '081234567890'
FROM events WHERE slug = 'pernikahan-fulan-fulana';

INSERT INTO guests (event_id, name, phone)
SELECT 
  id,
  'Siti Nurhaliza',
  '081234567891'
FROM events WHERE slug = 'pernikahan-fulan-fulana';
