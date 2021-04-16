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

  .get('/', (req, res, next) => {
    Beer
      .find()
      .then(beers => res.send(beers))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Beer
      .findById(req.params.id)
      .then(beer => res.send(beer))
      .catch(next);
  })

  .get('/beers/:id', ensureAuth, (req, res, next) => {
    Beer
      .findByAdminId(req.params.id)
      .then(beer => res.send(beer))
      .catch(next);
  })

  .put('/:id', ensureAuth, (req, res, next) => {
    Beer
      .updateBeerById(req.params.id, req.body)
      .then(beer => res.send(beer))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Beer
      .deleteBeerById(req.params.id)
      .then(beer => res.send(beer))
      .catch(next);
  });


