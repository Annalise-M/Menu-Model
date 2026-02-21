const { Router } = require('express');
const Beer = require('../models/beer');
const { validateBeer } = require('../validators/beer-validator');

module.exports = Router()
  .post('/', validateBeer, async (req, res, next) => {
    try {
      const beer = await Beer.insert({ ...req.body });
      res.send(beer);
    } catch (error) {
      next(error);
    }
  })

  .get('/', async (req, res, next) => {
    try {
      const beers = await Beer.find();
      res.send(beers);
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const beer = await Beer.findById(req.params.id);
      if (!beer) {
        return res.status(404).json({ error: 'Beer not found' });
      }
      res.send(beer);
    } catch (error) {
      next(error);
    }
  })

  .put('/:id', validateBeer, async (req, res, next) => {
    try {
      const beer = await Beer.updateBeerById(req.params.id, req.body);
      if (!beer) {
        return res.status(404).json({ error: 'Beer not found' });
      }
      res.send(beer);
    } catch (error) {
      next(error);
    }
  })

  .delete('/:id', async (req, res, next) => {
    try {
      const beer = await Beer.deleteBeerById(req.params.id);
      if (!beer) {
        return res.status(404).json({ error: 'Beer not found' });
      }
      res.send(beer);
    } catch (error) {
      next(error);
    }
  });


