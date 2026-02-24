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

const menuCategorySchema = z.object({
  name: z.string()
    .min(1, 'Category name is required')
    .max(50, 'Category name must be 50 characters or less')
    .transform(escapeHtml),
  displayOrder: z.number()
    .int('Display order must be an integer')
    .min(0, 'Display order must be non-negative')
    .optional(),
});

const validateMenuCategory = (req, res, next) => {
  try {
    menuCategorySchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors
    });
  }
};

module.exports = { validateMenuCategory, menuCategorySchema };
