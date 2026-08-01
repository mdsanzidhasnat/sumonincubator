import { z } from 'zod';

import { productFieldSchemas } from '../schemas/product.schema.js';

/**
 * Accepted header aliases per canonical field. Used both to normalize a file's
 * header row (CSV and XLSX) and to build the downloadable template.
 */
export const HEADER_ALIASES: Record<string, readonly string[]> = {
  sku: ['sku', 'product_sku'],
  title: ['title', 'product_title', 'name'],
  titleBn: ['title_bn', 'title_bangla', 'name_bn'],
  categoryKey: ['category_key', 'category_id'],
  category: ['category'],
  price: ['price', 'price_tk', 'selling_price'],
  originalPrice: ['original_price', 'regular_price', 'mrp'],
  currency: ['currency'],
  stockQty: ['stock_qty', 'stock', 'quantity'],
  rating: ['rating'],
  reviewCount: ['review_count', 'reviews'],
  imageUrls: ['image_urls', 'images', 'image'],
  isBestseller: ['is_bestseller', 'bestseller'],
  isFeatured: ['is_featured', 'featured'],
  specs: ['specs', 'specifications'],
  description: ['description'],
  descriptionBn: ['description_bn', 'description_bangla'],
};

export const CANONICAL_HEADERS = Object.keys(HEADER_ALIASES);

/**
 * Maps a raw header cell to its canonical field name, or `undefined` when the
 * column is not recognized (those columns are ignored).
 */
export function canonicalHeader(raw: string): string | undefined {
  const normalized = raw.trim().toLowerCase().replace(/[\s-]+/g, '_');
  for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
    if (field.toLowerCase() === normalized || aliases.includes(normalized)) return field;
  }
  return undefined;
}

/**
 * Zod schema for a single normalized import row. Prices are expected in cents
 * here (the normalizer converts Taka to cents before validation). `titleBn`
 * is optional and falls back to `title` in the service.
 */
export const importRowSchema = z.object({
  sku: productFieldSchemas.sku,
  title: productFieldSchemas.title,
  titleBn: productFieldSchemas.titleBn.optional(),
  categoryKey: productFieldSchemas.categoryKey,
  priceCents: productFieldSchemas.priceCents,
  originalPriceCents: productFieldSchemas.originalPriceCents.optional(),
  currency: productFieldSchemas.currency.optional(),
  stockQty: productFieldSchemas.stockQty.optional(),
  rating: productFieldSchemas.rating.optional(),
  reviewCount: productFieldSchemas.reviewCount.optional(),
  images: productFieldSchemas.images.optional(),
  isBestseller: productFieldSchemas.isBestseller.optional(),
  isFeatured: productFieldSchemas.isFeatured.optional(),
  specs: productFieldSchemas.specs.optional(),
  description: productFieldSchemas.description.optional(),
  descriptionBn: productFieldSchemas.descriptionBn.optional(),
});

export type ImportRowValue = z.infer<typeof importRowSchema>;

/** First zod issue message, or a generic fallback. */
export function firstIssueMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Invalid row';
}
