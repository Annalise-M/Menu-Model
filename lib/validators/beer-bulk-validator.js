const { z } = require('zod');
const { beerSchema } = require('./beer-validator');

const beerBulkSchema = z.object({
  items: z.array(beerSchema)
    .min(1, 'At least one item required')
    .max(1000, 'Maximum 1000 items per import')
});

const validateBeerBulk = (req, res, next) => {
  try {
    req.body = beerBulkSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Bulk validation failed',
      details: error.errors
    });
  }
};

module.exports = { validateBeerBulk, beerBulkSchema };
