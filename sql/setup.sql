DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS menus CASCADE;
DROP TABLE IF EXISTS beers CASCADE;
DROP TABLE IF EXISTS menu_categories CASCADE;
DROP TABLE IF EXISTS beer_categories CASCADE;

CREATE TABLE admins (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admins_email ON admins(email);

-- Menu Categories Table
CREATE TABLE menu_categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_menu_categories_display_order ON menu_categories(display_order);

-- Beer Categories Table
CREATE TABLE beer_categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_beer_categories_display_order ON beer_categories(display_order);

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

CREATE TABLE menus (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  item TEXT NOT NULL,
  detail TEXT,
  price DECIMAL(10,2) NOT NULL,
  available BOOLEAN NOT NULL DEFAULT true,
  category_id BIGINT REFERENCES menu_categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_menus_category_id ON menus(category_id);

CREATE TABLE beers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  brewery TEXT NOT NULL,
  style TEXT NOT NULL,
  abv DECIMAL(4,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  available BOOLEAN NOT NULL DEFAULT true,
  category_id BIGINT REFERENCES beer_categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_beers_category_id ON beers(category_id);
