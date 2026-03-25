-- ============================================
-- CHECKIN TABLE (Optional - for QR check-in feature)
-- ============================================

CREATE TABLE IF NOT EXISTS checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guest_id)
);

-- Index untuk performance
CREATE INDEX idx_checkins_guest_id ON checkins(guest_id);
CREATE INDEX idx_checkins_checked_in_at ON checkins(checked_in_at);

-- RLS Policies
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Checkins are viewable by everyone"
  ON checkins FOR SELECT
  USING (true);

CREATE POLICY "Checkins can be created by authenticated users"
  ON checkins FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Sample query untuk analytics
-- SELECT 
--   e.title,
--   COUNT(DISTINCT g.id) as total_guests,
--   COUNT(DISTINCT c.id) as checked_in,
--   ROUND(COUNT(DISTINCT c.id)::numeric / COUNT(DISTINCT g.id) * 100, 2) as checkin_rate
-- FROM events e
-- LEFT JOIN guests g ON g.event_id = e.id
-- LEFT JOIN checkins c ON c.guest_id = g.id
-- GROUP BY e.id, e.title;
