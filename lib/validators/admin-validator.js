const { z } = require('zod');

const adminSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const validateAdmin = (req, res, next) => {
  try {
    adminSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors
    });
  }
};

module.exports = { validateAdmin, adminSchema };
