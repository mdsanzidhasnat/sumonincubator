import { CANONICAL_HEADERS } from './import.schema.js';

const EXAMPLE_ROW: string[] = [
  'INC-AUTO-56-2',
  '56 Egg Automatic Incubator',
  '৫৬ ডিম অটোমেটিক ইনকিউবেটর',
  'incubators',
  '12500',
  '15000',
  'BDT',
  '25',
  '4.9',
  '142',
  'https://example.com/img-1.jpg, https://example.com/img-2.jpg',
  'true',
  'false',
  'Capacity = 56 eggs\nPower = 80W',
  'Automatic temperature control with digital display.',
  'অটোমেটিক তাপমাত্রা নিয়ন্ত্রণ সহ ডিজিটাল ডিসপ্লে।',
];

function escapeCsv(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** Builds the downloadable CSV template: canonical headers + one example row. */
export function buildTemplateCsv(): string {
  const header = CANONICAL_HEADERS.map(escapeCsv).join(',');
  const example = EXAMPLE_ROW.map(escapeCsv).join(',');
  return `${header}\n${example}\n`;
}
