const express = require('express');
const app = express();
const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'process.env.SECRET',
  baseURL: 'http://localhost:7890',
  clientID: 'Ch6b6zbuC4nokLsyW5d9VKNinbisi556',
  issuerBaseURL: 'https://dev-1aklamhz.us.auth0.com'
};

app.use(express.json());

app.use(auth(config));

app.get('/login', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
