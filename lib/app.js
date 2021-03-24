const express = require('express');
const app = express();
const { auth, requiresAuth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'process.env.SECRET',
  baseURL: 'http://localhost:7890',
  clientID: 'Ch6b6zbuC4nokLsyW5d9VKNinbisi556',
  issuerBaseURL: 'https://dev-1aklamhz.us.auth0.com'
};

app.use(auth(config));
app.use(express.json());


app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Not sure if I want profile info, but it is working via /profile route
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
