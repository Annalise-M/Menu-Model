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

// Routes
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/admin', requiresAuth(), (req, res) => 
  res.send('Welcome to the admin section.')
);

// Not sure if I want profile info, but it is working via /profile route
// app.get('/profile', requiresAuth(), (req, res) => {
//   res.send(JSON.stringify(req.oidc.user));
// });

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
