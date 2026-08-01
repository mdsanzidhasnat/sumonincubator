import { parse } from 'csv-parse';
import ExcelJS from 'exceljs';

import { canonicalHeader } from './import.schema.js';
import type { ImportFileKind, ParsedImportRow } from './import.types.js';

/** True for a `{}` record or one where every value is empty/whitespace. */
function isEmptyRow(cells: Record<string, string>): boolean {
  return Object.values(cells).every((value) => value.trim().length === 0);
}

/** Converts a parser record (object or array) into string cells keyed by canonical field. */
function toCells(record: unknown): Record<string, string> {
  const cells: Record<string, string> = {};
  if (!record || typeof record !== 'object') return cells;
  for (const [key, value] of Object.entries(record)) {
    if (value == null) continue;
    const text = String(value).trim();
    if (text.length > 0) cells[key] = text;
  }
  return cells;
}

/**
 * Detects the file kind by magic bytes first (xlsx is a ZIP starting with
 * PK\x03\x04), then the filename extension, then the MIME type. Browsers often
 * report CSV as `application/vnd.ms-excel`, so extension/magic win.
 */
export function detectFileKind(mimeType: string, filename: string, buffer: Buffer): ImportFileKind {
  const isZip =
    buffer.length >= 4 &&
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    buffer[2] === 0x03 &&
    buffer[3] === 0x04;
  if (isZip) return 'xlsx';

  const extension = filename.toLowerCase().split('.').pop() ?? '';
  if (extension === 'xlsx') return 'xlsx';
  if (extension === 'csv') return 'csv';

  if (/^application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet$/i.test(mimeType)) {
    return 'xlsx';
  }
  if (/^(text|application)\/(x-)?csv$/i.test(mimeType) || mimeType === 'application/vnd.ms-excel') {
    return 'csv';
  }
  return 'csv';
}

async function parseCsv(buffer: Buffer): Promise<ParsedImportRow[]> {
  const parser = parse({
    bom: true,
    columns: (headers: string[]) => headers.map((header) => canonicalHeader(header)),
    trim: true,
    skip_empty_lines: true,
    relax_column_count: true,
  });
  parser.write(buffer);
  parser.end();

  const rows: ParsedImportRow[] = [];
  let rowNumber = 1;
  for await (const record of parser) {
    rowNumber += 1;
    const cells = toCells(record);
    if (isEmptyRow(cells)) continue;
    rows.push({ rowNumber, cells });
  }
  return rows;
}

async function parseXlsx(buffer: Buffer): Promise<ParsedImportRow[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) return [];

  const rows: ParsedImportRow[] = [];
  let headerFields: string[] | null = null;

  worksheet.eachRow({ includeEmpty: false }, (row) => {
    const rawCells: Array<{ col: number; text: string }> = [];
    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      const text = cell.text == null ? '' : String(cell.text).trim();
      if (text.length > 0) rawCells.push({ col: colNumber, text });
    });

    if (headerFields == null) {
      headerFields = [];
      for (const entry of rawCells) {
        headerFields[entry.col] = canonicalHeader(entry.text) ?? '';
      }
      return;
    }

    const cells: Record<string, string> = {};
    for (const entry of rawCells) {
      const field = headerFields[entry.col];
      if (field) cells[field] = entry.text;
    }
    if (isEmptyRow(cells)) return;
    rows.push({ rowNumber: row.number, cells });
  });

  return rows;
}

/** Parses a file's bytes into non-empty data rows. */
export async function parseFile(buffer: Buffer, kind: ImportFileKind): Promise<ParsedImportRow[]> {
  return kind === 'xlsx' ? parseXlsx(buffer) : parseCsv(buffer);
}
