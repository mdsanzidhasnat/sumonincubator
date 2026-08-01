import { Router } from 'express';
import multer from 'multer';

import { UploadController } from '../controllers/upload.controller.js';
import { AppError } from '../errors/app-error.js';

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 10;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES, files: MAX_FILES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(400, `Unsupported file type: ${file.mimetype}`, 'UNSUPPORTED_MEDIA_TYPE'));
    }
  },
});

export function uploadRoutes(controller: UploadController, writable: boolean): Router {
  const router = Router();

  router.get('/products/:id', controller.get);

  if (writable) {
    router.post('/products', upload.array('images', MAX_FILES), controller.create);
    router.delete('/products/:id', controller.remove);
  }

  return router;
}
