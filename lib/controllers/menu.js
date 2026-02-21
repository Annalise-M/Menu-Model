const { Router } = require('express');
const Menu = require('../models/menu');
const { validateMenu } = require('../validators/menu-validator');

module.exports = Router()
  .post('/', validateMenu, (req, res, next) => {
    Menu
      .insert({ ...req.body })
      .then(menu => res.send(menu))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Menu
      .find()
      .then(menus => res.send(menus))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Menu
      .findById(req.params.id)
      .then(menu => res.send(menu))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Menu
      .findById(req.params.id)
      .then(menu => res.send(menu))
      .catch(next);
  })

  .put('/:id', validateMenu, (req, res, next) => {
    Menu
      .updateMenuById(req.params.id, req.body)
      .then(menu => res.send(menu))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Menu
      .deleteMenuById(req.params.id)
      .then(menu => res.send(menu))
      .catch(next);
  });
