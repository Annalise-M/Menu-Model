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

const menuSchema = z.object({
  item: z.string()
    .min(1, 'Item name is required')
    .max(100)
    .transform(escapeHtml),
  detail: z.string()
    .max(500)
    .optional()
    .nullable()
    .transform(val => val ? escapeHtml(val) : val),
  price: z.union([
    z.number().positive('Price must be positive'),
    z.string().regex(/^\d+\.?\d{0,2}$/, 'Price must be a valid number').transform(val => parseFloat(val))
  ]),
  available: z.boolean().optional(),
});

const validateMenu = (req, res, next) => {
  try {
    menuSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors
    });
  }
};

module.exports = { validateMenu, menuSchema };
