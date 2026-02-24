const { Router } = require('express');
const MenuCategory = require('../models/menu-category');
const { validateMenuCategory } = require('../validators/menu-category-validator');

module.exports = Router()
  .post('/', validateMenuCategory, async (req, res, next) => {
    try {
      const category = await MenuCategory.insert({ ...req.body });
      res.send(category);
    } catch (error) {
      // Handle duplicate category name (unique constraint violation)
      if (error.code === '23505') {
        return res.status(409).json({
          error: 'A category with this name already exists'
        });
      }
      next(error);
    }
  })

  .get('/', async (req, res, next) => {
    try {
      const categories = await MenuCategory.find();
      res.send(categories);
    } catch (error) {
      next(error);
    }
  })

  .get('/grouped', async (req, res, next) => {
    try {
      const grouped = await MenuCategory.getMenusGroupedByCategory();
      res.send(grouped);
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const category = await MenuCategory.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: 'Menu category not found' });
      }
      res.send(category);
    } catch (error) {
      next(error);
    }
  })

  .put('/:id', validateMenuCategory, async (req, res, next) => {
    try {
      const category = await MenuCategory.update(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({ error: 'Menu category not found' });
      }
      res.send(category);
    } catch (error) {
      // Handle duplicate category name
      if (error.code === '23505') {
        return res.status(409).json({
          error: 'A category with this name already exists'
        });
      }
      next(error);
    }
  })

  .delete('/:id', async (req, res, next) => {
    try {
      const category = await MenuCategory.delete(req.params.id);
      if (!category) {
        return res.status(404).json({ error: 'Menu category not found' });
      }
      res.send(category);
    } catch (error) {
      // Handle attempt to delete "Uncategorized"
      if (error.message === 'Cannot delete the Uncategorized category') {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  });
