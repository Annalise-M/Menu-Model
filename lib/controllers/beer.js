const { Router } = require('express');
const Beer = require('../models/beer');
const { validateBeer } = require('../validators/beer-validator');

module.exports = Router()
  .post('/', validateBeer, (req, res, next) => {
    Beer
      .insert({ ...req.body })
      .then(beer => res.send(beer))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Beer
      .find()
      .then(beers => res.send(beers))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Beer
      .findById(req.params.id)
      .then(beer => res.send(beer))
      .catch(next);
  })

  .put('/:id', validateBeer, (req, res, next) => {
    Beer
      .updateBeerById(req.params.id, req.body)
      .then(beer => res.send(beer))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Beer
      .deleteBeerById(req.params.id)
      .then(beer => res.send(beer))
      .catch(next);
  });


