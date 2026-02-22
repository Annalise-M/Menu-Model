const pool = require('../utils/pool');

class RestaurantSettings {
  id;
  restaurantName;
  tagline;
  logoUrl;
  backgroundImageUrl;
  primaryColor;
  accentColor;
  backgroundColor;
  createdAt;
  updatedAt;

  constructor(row) {
    this.id = row.id;
    this.restaurantName = row.restaurant_name;
    this.tagline = row.tagline;
    this.logoUrl = row.logo_url;
    this.backgroundImageUrl = row.background_image_url;
    this.primaryColor = row.primary_color;
    this.accentColor = row.accent_color;
    this.backgroundColor = row.background_color;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }

  // Get the single restaurant settings (id = 1)
  static async get() {
    const { rows } = await pool.query(
      'SELECT * FROM restaurant_settings WHERE id = 1'
    );

    if (!rows[0]) {
      // Return defaults if not found
      return new RestaurantSettings({
        id: 1,
        restaurant_name: 'The Traveling Taphouse',
        tagline: 'Craft Beers & Culinary Excellence',
        logo_url: null,
        background_image_url: null,
        primary_color: '#D4AF37',
        accent_color: '#B87333',
        background_color: '#1C1C1E',
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    return new RestaurantSettings(rows[0]);
  }

  // Update restaurant settings
  static async update(settings) {
    const { rows } = await pool.query(
      `UPDATE restaurant_settings
       SET restaurant_name = $1,
           tagline = $2,
           logo_url = $3,
           background_image_url = $4,
           primary_color = $5,
           accent_color = $6,
           background_color = $7,
           updated_at = NOW()
       WHERE id = 1
       RETURNING *`,
      [
        settings.restaurantName,
        settings.tagline,
        settings.logoUrl,
        settings.backgroundImageUrl,
        settings.primaryColor,
        settings.accentColor,
        settings.backgroundColor,
      ]
    );

    if (!rows[0]) {
      // If no row exists, insert it
      const { rows: insertedRows } = await pool.query(
        `INSERT INTO restaurant_settings (
          restaurant_name,
          tagline,
          logo_url,
          background_image_url,
          primary_color,
          accent_color,
          background_color
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
          settings.restaurantName,
          settings.tagline,
          settings.logoUrl,
          settings.backgroundImageUrl,
          settings.primaryColor,
          settings.accentColor,
          settings.backgroundColor,
        ]
      );
      return new RestaurantSettings(insertedRows[0]);
    }

    return new RestaurantSettings(rows[0]);
  }
}

module.exports = RestaurantSettings;
