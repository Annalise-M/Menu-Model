const express = require('express');
const app = express();
const { auth, requiresAuth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'process.env.SECRET',
  baseURL: 'http://localhost:7890',
  clientID: 'process.env.CLIENT_ID',
  issuerBaseURL: 'https://dev-1aklamhz.us.auth0.com'
};

// Middlewares
app.use(auth(config));
app.use(express.json());
app.use(require('cookie-parser')());

app.use('/api/v1/auth', require('./controllers/admin'));
app.use('/api/v1/menus', require('./controllers/menu'));
app.use('/api/v1/beers', require('./controllers/beer'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
