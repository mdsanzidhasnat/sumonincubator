import { Router } from 'express';
import { z } from 'zod';

import { ProductController } from '../controllers/product.controller.js';
import { validate } from '../middlewares/validate.js';
import { CATEGORY_KEYS } from '../models/category.model.js';

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

const productBodySchema = z.object({
  body: z.object({
    sku: z.string().min(1).max(64),
    title: z.string().min(1).max(200),
    titleBn: z.string().min(1).max(200),
    categoryKey: z.enum(CATEGORY_KEYS),
    priceCents: z.number().int().min(0),
    originalPriceCents: z.number().int().min(0).optional(),
    currency: z.string().min(3).max(8).default('BDT'),
    stockQty: z.number().int().min(0).default(0),
    rating: z.number().min(0).max(5).default(0),
    reviewCount: z.number().int().min(0).default(0),
    images: z.array(z.string().url()).max(10).default([]),
    isBestseller: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    specs: z.record(z.string(), z.string()).default({}),
    description: z.string().max(5000).default(''),
    descriptionBn: z.string().max(5000).default(''),
  }),
});

const createSchema = productBodySchema;
const updateSchema = z.object({
  params: idParamsSchema.shape.params,
  body: productBodySchema.shape.body.partial(),
});

export function productRoutes(controller: ProductController): Router {
  const router = Router();

  router.get('/', validate(listSchema), controller.list);
  router.get('/stats', controller.stats);
  router.get('/:slugOrId', validate(slugOrIdParamsSchema), controller.get);
  router.post('/', validate(createSchema), controller.create);
  router.put('/:id', validate(updateSchema), controller.update);
  router.delete('/:id', validate(idParamsSchema), controller.remove);

  return router;
}
