const { z } = require('zod');

const beerSchema = z.object({
  brewery: z.string().min(1, 'Brewery name is required').max(100),
  style: z.string().min(1, 'Beer style is required').max(100),
  abv: z.union([
    z.number().positive('ABV must be positive'),
    z.string().regex(/^\d+\.?\d{0,2}$/, 'ABV must be a valid number').transform(val => parseFloat(val))
  ]),
  price: z.union([
    z.number().positive('Price must be positive'),
    z.string().regex(/^\d+\.?\d{0,2}$/, 'Price must be a valid number').transform(val => parseFloat(val))
  ]),
});

const validateBeer = (req, res, next) => {
  try {
    beerSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors
    });
  }
};

module.exports = { validateBeer, beerSchema };
