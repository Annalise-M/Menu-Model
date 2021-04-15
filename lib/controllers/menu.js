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

  .get('/', (req, res, next) => {
    Menu
      .find()
      .then(menus => res.send(menus))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Menu
      .findById(req.params.id)
      .then(menu => res.send(menu))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Menu
      .findByAdminId(req.params.id)
      .then(menu => res.send(menu))
      .catch(next);
  })

  .put('/:id', ensureAuth, (req, res, next) => {
    Menu
      .updateMenuById(req.params.id, req.body)
      .then(menu => res.send(menu))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Menu
      .deleteMenuById(req.params.id)
      .then(menu => res.send(menu))
      .catch(next);
  });
