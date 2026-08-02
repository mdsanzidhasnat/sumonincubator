import { Router } from 'express';

import type { CategoryController } from '../controllers/category.controller.js';

export function categoryRoutes(controller: CategoryController): Router {
  const router = Router();

  router.get('/', controller.list);

  return router;
}
