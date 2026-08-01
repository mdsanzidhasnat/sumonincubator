import { CategoryModel } from '../models/category.model.js';
import type { ProductCreateInput } from '../models/product.model.js';
import { AppError } from '../errors/app-error.js';
import { ProductRepository } from '../repositories/product.repository.js';
import {
  detectFileKind,
  parseFile,
} from '../bulk-import/import.parser.js';
import { firstIssueMessage, importRowSchema, type ImportRowValue } from '../bulk-import/import.schema.js';
import { normalizeRow } from '../bulk-import/import.normalizer.js';
import { IMPORT_LIMITS } from '../bulk-import/import.types.js';
import type { BulkImportResult, CategoryLookup, RowFailure } from '../bulk-import/import.types.js';
import { slugify } from '../utils/slugify.js';

interface ValidEntry {
  row: number;
  sku: string;
  value: ImportRowValue;
}

const SKIPPED_IN_FILE = 'Duplicate SKU in file — skipped (first occurrence used)';
const SKIPPED_IN_DB = 'SKU already exists in the database — skipped';

export class BulkImportService {
  constructor(private readonly repository: ProductRepository) {}

  async import(buffer: Buffer, mimeType: string, filename: string): Promise<BulkImportResult> {
    const kind = detectFileKind(mimeType, filename, buffer);
    const rows = await parseFile(buffer, kind);
    if (rows.length === 0) {
      throw new AppError(400, 'No data rows found in the file', 'EMPTY_FILE');
    }
    if (rows.length > IMPORT_LIMITS.maxRows) {
      throw new AppError(
        400,
        `File exceeds the ${IMPORT_LIMITS.maxRows}-row limit`,
        'ROW_LIMIT_EXCEEDED',
      );
    }

    const lookups = await this.loadCategories();
    const { entries, failed } = this.validateRows(rows, lookups);

    let skipped = 0;
    const validBySku = new Map<string, ValidEntry>();
    for (const entry of entries) {
      if (validBySku.has(entry.sku)) {
        skipped += 1;
        failed.push({ row: entry.row, sku: entry.sku, message: SKIPPED_IN_FILE });
        continue;
      }
      validBySku.set(entry.sku, entry);
    }

    const existing = await this.repository.findManyBySkus([...validBySku.keys()]);
    const existingSkus = new Set(existing);
    const toCreate: ValidEntry[] = [];
    for (const entry of validBySku.values()) {
      if (existingSkus.has(entry.sku)) {
        skipped += 1;
        failed.push({ row: entry.row, sku: entry.sku, message: SKIPPED_IN_DB });
        continue;
      }
      toCreate.push(entry);
    }

    const docs = await this.buildDocs(toCreate, lookups);
    const writeResult = await this.repository.createMany(docs);
    for (const failure of writeResult.failures) {
      const entry = toCreate[failure.index];
      if (entry) {
        failed.push({ row: entry.row, sku: entry.sku, message: failure.message });
      }
    }

    return {
      total: rows.length,
      created: writeResult.createdCount,
      skipped,
      failed,
    };
  }

  private async loadCategories(): Promise<CategoryLookup[]> {
    const categories = await CategoryModel.find().select('key name nameBn').lean();
    return categories.map((category) => ({
      id: category._id.toString(),
      key: category.key,
      name: category.name,
      nameBn: category.nameBn,
    }));
  }

  private validateRows(
    rows: Array<{ rowNumber: number; cells: Record<string, string> }>,
    lookups: CategoryLookup[],
  ): { entries: ValidEntry[]; failed: RowFailure[] } {
    const entries: ValidEntry[] = [];
    const failed: RowFailure[] = [];

    for (const row of rows) {
      const raw = normalizeRow(row.cells, lookups);
      const parsed = importRowSchema.safeParse(raw);
      if (!parsed.success) {
        failed.push({ row: row.rowNumber, sku: raw.sku ?? '', message: firstIssueMessage(parsed.error) });
        continue;
      }
      entries.push({ row: row.rowNumber, sku: parsed.data.sku, value: parsed.data });
    }

    return { entries, failed };
  }

  private async buildDocs(
    entries: ValidEntry[],
    lookups: CategoryLookup[],
  ): Promise<ProductCreateInput[]> {
    const categoryByKey = new Map(lookups.map((c) => [c.key, c.id]));
    const bases = entries.map((entry) => slugify(entry.value.title) || 'product');
    const taken = new Set(await this.repository.findSlugsByBases([...new Set(bases)]));

    const docs: ProductCreateInput[] = [];
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (!entry) continue;
      const value = entry.value;

      let candidate = bases[i] ?? 'product';
      let n = 1;
      while (taken.has(candidate)) {
        n += 1;
        candidate = `${bases[i] ?? 'product'}-${n}`;
      }
      taken.add(candidate);

      docs.push({
        sku: value.sku,
        slug: candidate,
        title: value.title,
        titleBn: value.titleBn ?? value.title,
        category: categoryByKey.get(value.categoryKey) ?? '',
        priceCents: value.priceCents,
        originalPriceCents: value.originalPriceCents ?? null,
        currency: value.currency ?? 'BDT',
        stockQty: value.stockQty ?? 0,
        rating: value.rating ?? 0,
        reviewCount: value.reviewCount ?? 0,
        images: value.images ?? [],
        isBestseller: value.isBestseller ?? false,
        isFeatured: value.isFeatured ?? false,
        specs: value.specs ?? {},
        description: value.description ?? '',
        descriptionBn: value.descriptionBn ?? '',
      });
    }

    return docs;
  }
}
