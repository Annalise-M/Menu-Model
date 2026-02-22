const { z } = require('zod');

// HTML escape function to prevent XSS
const escapeHtml = (text) => {
  if (!text) return text;
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
};

// Hex color validation
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const restaurantSettingsSchema = z.object({
  restaurantName: z.string()
    .min(1, 'Restaurant name is required')
    .max(255, 'Restaurant name too long')
    .transform(escapeHtml),
  tagline: z.string()
    .max(255, 'Tagline too long')
    .optional()
    .nullable()
    .transform(val => val ? escapeHtml(val) : val),
  logoUrl: z.string()
    .url('Logo URL must be a valid URL')
    .max(2048, 'URL too long')
    .optional()
    .nullable()
    .or(z.literal('')), // Allow empty string
  backgroundImageUrl: z.string()
    .url('Background image URL must be a valid URL')
    .max(2048, 'URL too long')
    .optional()
    .nullable()
    .or(z.literal('')), // Allow empty string
  primaryColor: z.string()
    .regex(hexColorRegex, 'Primary color must be a valid hex color (e.g., #D4AF37)')
    .optional(),
  accentColor: z.string()
    .regex(hexColorRegex, 'Accent color must be a valid hex color (e.g., #B87333)')
    .optional(),
  backgroundColor: z.string()
    .regex(hexColorRegex, 'Background color must be a valid hex color (e.g., #1C1C1E)')
    .optional(),
});

const validateRestaurantSettings = (req, res, next) => {
  try {
    const validated = restaurantSettingsSchema.parse(req.body);
    req.body = validated; // Replace with validated/transformed data
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors
    });
  }
};

module.exports = { validateRestaurantSettings, restaurantSettingsSchema };
