const { Router } = require('express');
const Menu = require('../models/menu');
const { validateMenu } = require('../validators/menu-validator');

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
  });
