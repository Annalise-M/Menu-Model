-- Restaurant Settings Table
-- Stores branding and customization for white-label deployment

CREATE TABLE IF NOT EXISTS restaurant_settings (
  id SERIAL PRIMARY KEY,
  restaurant_name VARCHAR(255) NOT NULL DEFAULT 'The Traveling Taphouse',
  tagline VARCHAR(255) DEFAULT 'Craft Beers & Culinary Excellence',
  logo_url TEXT,
  background_image_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#D4AF37', -- Gold
  accent_color VARCHAR(7) DEFAULT '#B87333',   -- Copper
  background_color VARCHAR(7) DEFAULT '#1C1C1E', -- Charcoal
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default settings
INSERT INTO restaurant_settings (
  restaurant_name,
  tagline,
  primary_color,
  accent_color,
  background_color
) VALUES (
  'The Traveling Taphouse',
  'Craft Beers & Culinary Excellence',
  '#D4AF37',
  '#B87333',
  '#1C1C1E'
) ON CONFLICT DO NOTHING;

-- Only allow one row (single restaurant configuration)
CREATE UNIQUE INDEX IF NOT EXISTS single_restaurant_settings ON restaurant_settings ((id IS NOT NULL)) WHERE id = 1;
