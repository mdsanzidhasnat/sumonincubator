export type ImportFileKind = 'csv' | 'xlsx';

/** A single parsed data row. `rowNumber` is 1-based (header is row 1). */
export interface ParsedImportRow {
  rowNumber: number;
  cells: Record<string, string>;
}

/** One row that could not be created. `sku` may be empty for malformed rows. */
export interface RowFailure {
  row: number;
  sku: string;
  message: string;
}

/**
 * Summary of a bulk import.
 * `total` = non-empty data rows in the file.
 * `created` = rows successfully inserted.
 * `skipped` = rows that were valid but skipped because their SKU already
 *             exists (in the DB or earlier in the same file).
 * `failed`  = per-row problems (validation errors, duplicates, write errors);
 *             `failed.length === total - created` and includes all skipped rows.
 */
export interface BulkImportResult {
  total: number;
  created: number;
  skipped: number;
  failed: RowFailure[];
}

/** Hard limits enforced at the upload boundary and in the service. */
export const IMPORT_LIMITS = {
  maxRows: 1000,
  maxFileBytes: 5 * 1024 * 1024,
} as const;

/** Minimal category metadata used to resolve a category name/key in a row. */
export interface CategoryLookup {
  id: string;
  key: string;
  name: string;
  nameBn: string;
}
