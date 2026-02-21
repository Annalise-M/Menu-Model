const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const AdminService = require('../services/admin-service');
const { validateAdmin } = require('../validators/admin-validator');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

const attachCookie = (admin, res) => {
  const token = AdminService.makeToken(admin);
  res.cookie('session', token, {
    maxAge: ONE_DAY_IN_MS,
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV !== 'test'
  });
};

module.exports = Router()
  .post('/signup', validateAdmin, async (req, res, next) => {
    try {
      const admin = await AdminService.create(req.body);
      attachCookie(admin, res);
      res.send(admin);
    } catch (error) {
      next(error);
    }
  })

  .post('/login', validateAdmin, async (req, res, next) => {
    try {
      const admin = await AdminService.authorize(req.body);
      attachCookie(admin, res);
      res.send(admin);
    } catch (error) {
      next(error);
    }
  })

  .get('/verify', ensureAuth, (req, res) => {
    res.send(req.admin);
  });
