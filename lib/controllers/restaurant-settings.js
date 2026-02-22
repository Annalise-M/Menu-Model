const { Router } = require('express');
const RestaurantSettings = require('../models/restaurant-settings');
const { validateRestaurantSettings } = require('../validators/restaurant-settings-validator');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  // GET /api/v1/settings - Public endpoint to fetch restaurant branding
  .get('/', async (req, res, next) => {
    try {
      const settings = await RestaurantSettings.get();
      res.send(settings);
    } catch (error) {
      next(error);
    }
  })

  // PUT /api/v1/settings - Protected endpoint to update settings (managers only)
  .put('/', ensureAuth, validateRestaurantSettings, async (req, res, next) => {
    try {
      const settings = await RestaurantSettings.update(req.body);
      res.send(settings);
    } catch (error) {
      next(error);
    }
  });
