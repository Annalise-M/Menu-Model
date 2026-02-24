const { Router } = require('express');
const Menu = require('../models/menu');
const { validateMenu } = require('../validators/menu-validator');
const { validateMenuBulk } = require('../validators/menu-bulk-validator');
const pool = require('../utils/pool');

module.exports = Router()
  .post('/', validateMenu, async (req, res, next) => {
    try {
      const menu = await Menu.insert({ ...req.body });
      res.send(menu);
    } catch (error) {
      next(error);
    }
  })

  .get('/', async (req, res, next) => {
    try {
      const menus = await Menu.find();
      res.send(menus);
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const menu = await Menu.findById(req.params.id);
      if (!menu) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
      res.send(menu);
    } catch (error) {
      next(error);
    }
  })

  .put('/:id', validateMenu, async (req, res, next) => {
    try {
      const menu = await Menu.updateMenuById(req.params.id, req.body);
      if (!menu) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
      res.send(menu);
    } catch (error) {
      next(error);
    }
  })

  .delete('/:id', async (req, res, next) => {
    try {
      const menu = await Menu.deleteMenuById(req.params.id);
      if (!menu) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
      res.send(menu);
    } catch (error) {
      next(error);
    }
  })

  .post('/bulk-import', validateMenuBulk, async (req, res, next) => {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const { items } = req.body;
      const BATCH_SIZE = 100;
      const results = [];

      // Insert in batches of 100 to avoid parameter limits
      for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);
        const inserted = await Menu.bulkInsert(batch, client);
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
  });
