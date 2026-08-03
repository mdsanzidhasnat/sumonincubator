import { Router, type RequestHandler } from 'express';

import type { OrderController } from '../controllers/order.controller.js';
import { validate } from '../middlewares/validate.js';
import { createOrderSchema, listOrdersSchema, retryCourierParamsSchema, updateStatusSchema } from '../schemas/order.schema.js';

export function orderRoutes(
  controller: OrderController,
  adminMiddleware: RequestHandler,
): Router {
  const router = Router();

  router.post('/', validate(createOrderSchema), controller.create);

  router.get('/', adminMiddleware, validate(listOrdersSchema), controller.list);
  router.get('/stats', adminMiddleware, controller.stats);
  router.get('/:id', adminMiddleware, controller.get);
  router.patch(
    '/:id/status',
    adminMiddleware,
    validate(updateStatusSchema),
    controller.updateStatus,
  );
  router.post(
    '/:id/retry-courier',
    adminMiddleware,
    validate(retryCourierParamsSchema),
    controller.retryCourier,
  );

  return router;
}
