const express = require('express');
const helmet = require('helmet');

const app = express();

// Security headers
app.use(helmet());

// Rate limiting for auth endpoints (only in production)
if (process.env.NODE_ENV !== 'test') {
  const rateLimit = require('express-rate-limit');
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs
    message: 'Too many login attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/v1/auth', authLimiter);
}

app.use(require('cookie-parser')());

// CORS configuration - restrict to specific origins in production
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:7891', 'http://localhost:3000'];

app.use(require('cors')({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Increase body size limit to handle base64 images (default is 100kb)
app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use('/api/v1/auth', require('./controllers/admin'));
app.use('/api/v1/menus', require('./controllers/menu'));
app.use('/api/v1/beers', require('./controllers/beer'));
app.use('/api/v1/settings', require('./controllers/restaurant-settings'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
