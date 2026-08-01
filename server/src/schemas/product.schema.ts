import { z } from 'zod';

import { CATEGORY_KEYS } from '../models/category.model.js';

/**
 * Field-level zod constraints for a product. Single source of truth shared by
 * the single-product create/update flow (routes) and the bulk import row
 * validation so both stay in sync.
 */
export const productFieldSchemas = {
  sku: z.string().min(1).max(64),
  title: z.string().min(1).max(200),
  titleBn: z.string().min(1).max(200),
  categoryKey: z.enum(CATEGORY_KEYS),
  priceCents: z.number().int().min(0),
  originalPriceCents: z.number().int().min(0),
  currency: z.string().min(3).max(8),
  stockQty: z.number().int().min(0),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  images: z.array(z.string().url()).max(10),
  isBestseller: z.boolean(),
  isFeatured: z.boolean(),
  specs: z.record(z.string(), z.string()),
  description: z.string().max(5000),
  descriptionBn: z.string().max(5000),
} as const;

export const productBodySchema = z.object({
  body: z.object({
    ...productFieldSchemas,
    originalPriceCents: productFieldSchemas.originalPriceCents.optional(),
    currency: productFieldSchemas.currency.default('BDT'),
    stockQty: productFieldSchemas.stockQty.default(0),
    rating: productFieldSchemas.rating.default(0),
    reviewCount: productFieldSchemas.reviewCount.default(0),
    images: productFieldSchemas.images.default([]),
    isBestseller: productFieldSchemas.isBestseller.default(false),
    isFeatured: productFieldSchemas.isFeatured.default(false),
    specs: productFieldSchemas.specs.default({}),
    description: productFieldSchemas.description.default(''),
    descriptionBn: productFieldSchemas.descriptionBn.default(''),
  }),
});

export type ProductBodyInput = z.infer<typeof productBodySchema>['body'];
