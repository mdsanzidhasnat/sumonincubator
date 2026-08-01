import multer from 'multer';

import { IMPORT_LIMITS } from '../bulk-import/import.types.js';
import { AppError } from '../errors/app-error.js';

const ALLOWED_MIME = new Set([
  'text/csv',
  'application/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

/**
 * Multer setup for the bulk import endpoint. Single `file` field, buffered in
 * memory, capped at 5 MB. The file's real format is validated by magic bytes
 * in the parser, so the filter is intentionally lenient (accepts CSV/XLSX
 * MIME types or extensions).
 */
export const importUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: IMPORT_LIMITS.maxFileBytes, files: 1 },
  fileFilter: (_req, file, cb) => {
    const allowed =
      ALLOWED_MIME.has(file.mimetype) || /\.(csv|xlsx)$/i.test(file.originalname);
    if (allowed) {
      cb(null, true);
    } else {
      cb(new AppError(400, `Unsupported file type: ${file.mimetype}`, 'INVALID_FILE_TYPE'));
    }
  },
});
