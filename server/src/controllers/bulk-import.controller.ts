import type { Request, Response } from 'express';

import { BulkImportService } from '../services/bulk-import.service.js';
import { asyncHandler } from '../middlewares/error.js';
import { AppError } from '../errors/app-error.js';
import { buildTemplateCsv } from '../bulk-import/import.template.js';

export class BulkImportController {
  constructor(private readonly service: BulkImportService) {}

  getTemplate = (_req: Request, res: Response): void => {
    res
      .status(200)
      .setHeader('Content-Type', 'text/csv; charset=utf-8')
      .setHeader('Content-Disposition', 'attachment; filename="products-import-template.csv"')
      .setHeader('Cache-Control', 'no-store')
      .send(`\uFEFF${buildTemplateCsv()}`);
  };

  importProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const file = req.file;
    if (!file) {
      throw new AppError(
        400,
        'No file uploaded. Send a multipart request with the file in the "file" field.',
        'EMPTY_FILE',
      );
    }
    if (file.size === 0) {
      throw new AppError(400, 'The uploaded file is empty', 'EMPTY_FILE');
    }

    const result = await this.service.import(file.buffer, file.mimetype, file.originalname);
    res.status(200).json(result);
  });
}
