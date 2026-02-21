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

app.use(require('cors')({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/auth', require('./controllers/admin'));
app.use('/api/v1/menus', require('./controllers/menu'));
app.use('/api/v1/beers', require('./controllers/beer'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
