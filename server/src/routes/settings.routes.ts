import { Router, type RequestHandler } from 'express';

import type { SettingsController } from '../controllers/settings.controller.js';
import { validate } from '../middlewares/validate.js';
import { brandSettingsSchema, contactSettingsSchema, heroSettingsSchema } from '../schemas/settings.schema.js';

export function settingsRoutes(
  controller: SettingsController,
  adminMiddleware: RequestHandler,
): Router {
  const router = Router();

  router.get('/contact', controller.getContact);
  router.put('/contact', adminMiddleware, validate(contactSettingsSchema), controller.updateContact);
  router.get('/hero', controller.getHero);
  router.put('/hero', adminMiddleware, validate(heroSettingsSchema), controller.updateHero);
  router.get('/brand', controller.getBrand);
  router.put('/brand', adminMiddleware, validate(brandSettingsSchema), controller.updateBrand);

  return router;
}
