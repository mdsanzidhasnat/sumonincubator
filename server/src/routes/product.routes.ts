import { Router } from 'express';
import { z } from 'zod';

import type { RequestHandler } from 'express';
import { BulkImportController } from '../controllers/bulk-import.controller.js';
import { ProductController } from '../controllers/product.controller.js';
import { validate } from '../middlewares/validate.js';
import { importUpload } from '../middlewares/import-upload.js';
import { productBodySchema } from '../schemas/product.schema.js';

const listQuerySchema = z.object({
  category: z.string().optional(),
  q: z.string().max(100).optional(),
  sort: z.enum(['price_asc', 'price_desc', 'rating', 'newest']).optional(),
  bestseller: z.enum(['true', 'false']).optional(),
  featured: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

const listSchema = z.object({
  query: listQuerySchema,
});

const slugOrIdParamsSchema = z.object({
  params: z.object({
    slugOrId: z.string().min(1).max(200),
  }),
});

const idParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1).max(64),
  }),
});

const createSchema = productBodySchema;
const updateSchema = z.object({
  params: idParamsSchema.shape.params,
  body: productBodySchema.shape.body.partial(),
});

export function productRoutes(
  controller: ProductController,
  bulkImport: BulkImportController,
  protect?: RequestHandler,
): Router {
  const router = Router();

  const handlers: RequestHandler[] = [];
  if (protect) handlers.push(protect);

  router.get('/', validate(listSchema), controller.list);
  router.get('/stats', controller.stats);
  router.get('/import/template', bulkImport.getTemplate);
  router.post('/import', importUpload.single('file'), bulkImport.importProducts);
  router.get('/:slugOrId', validate(slugOrIdParamsSchema), controller.get);
  router.post('/', ...handlers, validate(createSchema), controller.create);
  router.put('/:id', ...handlers, validate(updateSchema), controller.update);
  router.delete('/:id', ...handlers, validate(idParamsSchema), controller.remove);

  return router;
}
