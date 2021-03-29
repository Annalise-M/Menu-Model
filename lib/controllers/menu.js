const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Menu = require('../models/menu');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Menu
      .insert({ ...req.body, adminId: req.admin.id })
      .then(menu => res.send(menu))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Menu
      .findById(req.params.id)
      .then(menu => res.send(menu))
      .catch(next);
  })

  .get('/admin/:id', (req, res, next) => {
    Menu
      .findByAdminId(req.params.id)
      .then(menus => res.send(menus))
      .catch(next);
  });
