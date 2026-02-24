const { Router } = require('express');
const Beer = require('../models/beer');
const { validateBeer } = require('../validators/beer-validator');
const { validateBeerBulk } = require('../validators/beer-bulk-validator');
const pool = require('../utils/pool');

module.exports = Router()
  .post('/bulk-import', validateBeerBulk, async (req, res, next) => {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const { items } = req.body;
      const BATCH_SIZE = 100;
      const results = [];

      // Insert in batches of 100 to avoid parameter limits
      for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);
        const inserted = await Beer.bulkInsert(batch, client);
        results.push(...inserted);
      }

      await client.query('COMMIT');
      res.json({ success: true, imported: results.length, items: results });

    } catch (error) {
      await client.query('ROLLBACK');
      next(error);
    } finally {
      client.release();
    }
  })

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


