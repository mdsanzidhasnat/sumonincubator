import { Router, type RequestHandler } from 'express';

import type { AnalyticsController } from '../controllers/analytics.controller.js';
import { validate } from '../middlewares/validate.js';
import { listEventsSchema, trackEventSchema } from '../schemas/analytics.schema.js';

export function analyticsRoutes(
  controller: AnalyticsController,
  adminMiddleware: RequestHandler,
): Router {
  const router = Router();

  router.post('/track', validate(trackEventSchema), controller.track);
  router.get('/stats', adminMiddleware, controller.stats);
  router.get('/events', adminMiddleware, validate(listEventsSchema), controller.list);

  return router;
}
