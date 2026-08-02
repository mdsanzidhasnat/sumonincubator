import { Router, type RequestHandler } from 'express';

import type { SettingsController } from '../controllers/settings.controller.js';
import { validate } from '../middlewares/validate.js';
import { contactSettingsSchema } from '../schemas/settings.schema.js';

export function settingsRoutes(
  controller: SettingsController,
  adminMiddleware: RequestHandler,
): Router {
  const router = Router();

  router.get('/contact', controller.getContact);
  router.put('/contact', adminMiddleware, validate(contactSettingsSchema), controller.updateContact);

  return router;
}
