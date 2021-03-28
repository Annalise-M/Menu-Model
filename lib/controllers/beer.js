const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Beer = require('../models/beer');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Beer
      .insert({ ...req.body, adminId: req.admin.id })
      .then(beer => res.send(beer))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Beer
      .findById(req.params.id)
      .then(beer => res.send(beer))
      .catch(next);
  })

  .get('/admin/:id', (req, res, next) => {
    Beer
      .findByAdminId(req.params.id)
      .then(beers => res.send(beers))
      .catch(next);
  });
