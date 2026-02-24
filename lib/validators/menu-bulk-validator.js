const { z } = require('zod');
const { menuSchema } = require('./menu-validator');

const menuBulkSchema = z.object({
  items: z.array(menuSchema)
    .min(1, 'At least one item required')
    .max(1000, 'Maximum 1000 items per import')
});

const validateMenuBulk = (req, res, next) => {
  try {
    req.body = menuBulkSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Bulk validation failed',
      details: error.errors
    });
  }
};

module.exports = { validateMenuBulk, menuBulkSchema };
