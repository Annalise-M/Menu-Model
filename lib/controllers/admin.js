const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const AdminService = require('../services/admin-service');


const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

const attachCookie = (admin, res) => {
  const token = AdminService.makeToken(admin);
  res.cookie('session', token, {
    maxAge: ONE_DAY_IN_MS,
    httpOnly: true,
    sameSite: 'none'
  });
};

module.exports = Router()
  .post('/signup', (req, res, next) => {
    AdminService
      .create(req.body)
      .then(admin => {
        attachCookie(admin, res);
        res.send(admin);
      })
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    AdminService
      .authorize(req.body)
      .then(admin => {
        attachCookie(admin, res);
        res.send(admin);
      })
      .catch(next);
  })

  .get('/verify', ensureAuth, (req, res) => {
    res.send(req.admin);
  });
