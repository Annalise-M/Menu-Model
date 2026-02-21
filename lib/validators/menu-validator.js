const { z } = require('zod');

const menuSchema = z.object({
  item: z.string().min(1, 'Item name is required').max(100),
  detail: z.string().max(500).optional().nullable(),
  price: z.union([
    z.number().positive('Price must be positive'),
    z.string().regex(/^\d+\.?\d{0,2}$/, 'Price must be a valid number').transform(val => parseFloat(val))
  ]),
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
