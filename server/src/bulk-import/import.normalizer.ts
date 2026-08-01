import { CATEGORY_KEYS } from '../models/category.model.js';
import type { CategoryLookup } from './import.types.js';

export interface RawImportValue {
  sku?: string;
  title?: string;
  titleBn?: string;
  categoryKey?: string;
  priceCents?: number;
  originalPriceCents?: number;
  currency?: string;
  stockQty?: number;
  rating?: number;
  reviewCount?: number;
  images?: string[];
  isBestseller?: boolean;
  isFeatured?: boolean;
  specs?: Record<string, string>;
  description?: string;
  descriptionBn?: string;
}

function cell(cells: Record<string, string>, field: string): string | undefined {
  const value = cells[field];
  if (value == null) return undefined;
  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function toNumber(value: string | undefined): number | undefined {
  if (value == null) return undefined;
  const cleaned = String(value).replace(/[,৳]/g, '').trim();
  if (cleaned.length === 0) return undefined;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function toInteger(value: string | undefined): number | undefined {
  const parsed = toNumber(value);
  return parsed == null ? undefined : Math.trunc(parsed);
}

/** "true"/"yes"/"1"/"y"/"on" (case-insensitive) map to true; empty maps to undefined. */
export function toBoolean(value: string | undefined): boolean | undefined {
  if (value == null) return undefined;
  const normalized = String(value).trim().toLowerCase();
  if (normalized.length === 0) return undefined;
  return ['true', 'yes', '1', 'y', 'on'].includes(normalized);
}

/** Prices are authored in Taka in the file and stored as cents in the DB. */
export function toPriceCents(value: string | undefined): number | undefined {
  const parsed = toNumber(value);
  return parsed == null ? undefined : Math.round(parsed * 100);
}

/** Splits a column on commas, newlines, semicolons and pipes into trimmed URLs. */
export function toUrlList(value: string | undefined): string[] | undefined {
  if (value == null) return undefined;
  const urls = value
    .split(/[\n;,]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  return urls.length > 0 ? urls : undefined;
}

/** Parses `key = value` / `key: value` lines into a specs map. */
export function toSpecs(value: string | undefined): Record<string, string> | undefined {
  if (value == null) return undefined;
  const specs: Record<string, string> = {};
  for (const rawLine of String(value).split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.length === 0) continue;
    const idx = line.search(/[:=]/);
    const key = idx > 0 ? line.slice(0, idx).trim() : line;
    const val = idx > 0 ? line.slice(idx + 1).trim() : '';
    if (key.length > 0) specs[key] = val;
  }
  return Object.keys(specs).length > 0 ? specs : undefined;
}

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/[\s-]+/g, '_');
}

/**
 * Resolves a category cell (key, English name or Bangla name) to a category
 * key, or `undefined` when nothing matches.
 */
export function resolveCategory(
  value: string | undefined,
  categories: CategoryLookup[],
): string | undefined {
  if (value == null) return undefined;
  const normalized = normalizeKey(value);

  const direct = CATEGORY_KEYS.find((key) => normalizeKey(key) === normalized);
  if (direct) return direct;

  const match = categories.find(
    (c) => normalizeKey(c.key) === normalized || normalizeKey(c.name) === normalized || normalizeKey(c.nameBn) === normalized,
  );
  return match?.key;
}

/** Coerces the raw string cells of one row into typed values for validation. */
export function normalizeRow(
  cells: Record<string, string>,
  categories: CategoryLookup[],
): RawImportValue {
  const images = toUrlList(cell(cells, 'imageUrls')) ?? toUrlList(cell(cells, 'images'));
  const categoryKey =
    resolveCategory(cell(cells, 'categoryKey'), categories) ??
    resolveCategory(cell(cells, 'category'), categories);

  const value: RawImportValue = {
    sku: cell(cells, 'sku'),
    title: cell(cells, 'title'),
    titleBn: cell(cells, 'titleBn'),
    categoryKey,
    priceCents: toPriceCents(cell(cells, 'price')),
    originalPriceCents: toPriceCents(cell(cells, 'originalPrice')),
    currency: cell(cells, 'currency'),
    stockQty: toInteger(cell(cells, 'stockQty')),
    rating: toNumber(cell(cells, 'rating')),
    reviewCount: toInteger(cell(cells, 'reviewCount')),
    images,
    isBestseller: toBoolean(cell(cells, 'isBestseller')),
    isFeatured: toBoolean(cell(cells, 'isFeatured')),
    specs: toSpecs(cell(cells, 'specs')),
    description: cell(cells, 'description'),
    descriptionBn: cell(cells, 'descriptionBn'),
  };

  return value;
}
