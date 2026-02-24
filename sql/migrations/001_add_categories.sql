-- Migration: Add Categories Feature
-- Date: 2026-02-23
-- Description: Creates menu_categories and beer_categories tables with foreign keys to menus and beers

-- ===========================================
-- CREATE MENU CATEGORIES TABLE
-- ===========================================

CREATE TABLE menu_categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for sorting categories by display order
CREATE INDEX idx_menu_categories_display_order ON menu_categories(display_order);

-- ===========================================
-- CREATE BEER CATEGORIES TABLE
-- ===========================================

CREATE TABLE beer_categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for sorting categories by display order
CREATE INDEX idx_beer_categories_display_order ON beer_categories(display_order);

-- ===========================================
-- INSERT DEFAULT CATEGORIES
-- ===========================================

-- Default menu categories
INSERT INTO menu_categories (name, display_order) VALUES
  ('Uncategorized', 0),
  ('Appetizers', 1),
  ('Salads', 2),
  ('Entrees', 3),
  ('Sides', 4),
  ('Desserts', 5);

-- Default beer categories
INSERT INTO beer_categories (name, display_order) VALUES
  ('Uncategorized', 0),
  ('On Tap', 1),
  ('Bottled Beer', 2),
  ('Ciders', 3),
  ('Seasonal', 4);

-- ===========================================
-- ALTER EXISTING TABLES
-- ===========================================

-- Add category_id foreign key to menus table
-- ON DELETE SET NULL ensures items aren't deleted when category is deleted
ALTER TABLE menus
  ADD COLUMN category_id BIGINT REFERENCES menu_categories(id) ON DELETE SET NULL;

-- Add category_id foreign key to beers table
ALTER TABLE beers
  ADD COLUMN category_id BIGINT REFERENCES beer_categories(id) ON DELETE SET NULL;

-- Create indexes for JOIN performance
CREATE INDEX idx_menus_category_id ON menus(category_id);
CREATE INDEX idx_beers_category_id ON beers(category_id);

-- ===========================================
-- BACKFILL EXISTING DATA
-- ===========================================

-- Assign all existing menu items to "Uncategorized"
UPDATE menus
SET category_id = (SELECT id FROM menu_categories WHERE name = 'Uncategorized')
WHERE category_id IS NULL;

-- Assign all existing beers to "Uncategorized"
UPDATE beers
SET category_id = (SELECT id FROM beer_categories WHERE name = 'Uncategorized')
WHERE category_id IS NULL;
