import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { corsOrigins, env } from './config/env.js';
import { AppError } from './errors/app-error.js';
import { errorHandler, notFoundHandler } from './middlewares/error.js';
import { requireAdmin } from './middlewares/auth.js';
import { productRoutes } from './routes/product.routes.js';
import { uploadRoutes } from './routes/upload.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { categoryRoutes } from './routes/categories.routes.js';
import type { ProductController } from './controllers/product.controller.js';
import type { UploadController } from './controllers/upload.controller.js';
import type { BulkImportController } from './controllers/bulk-import.controller.js';
import type { CategoryController } from './controllers/category.controller.js';

export interface AppDeps {
  productController: ProductController;
  uploadController: UploadController;
  bulkImportController: BulkImportController;
  categoryController: CategoryController;
}

const adminStaticDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../public/admin',
);

export async function createApp(deps: AppDeps): Promise<Express> {
  const app = express();
  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'img-src': ["'self'", 'data:', 'https:'],
        },
      },
    }),
  );
  app.use(
    cors({
      origin: corsOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
  );
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/v1/auth', authRoutes());
  app.use('/api/v1/categories', categoryRoutes(deps.categoryController));
  app.use(
    '/api/v1/products',
    productRoutes(deps.productController, deps.bulkImportController, requireAdmin()),
  );
  app.use(
    '/api/v1/uploads',
    uploadRoutes(deps.uploadController, true, requireAdmin()),
  );

  if (env.ADMIN_ENABLED) {
    app.use(env.ADMIN_PATH, express.static(adminStaticDir));
    app.use(env.ADMIN_PATH, (req: Request, res: Response, next: NextFunction) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        next();
        return;
      }
      if (req.path.includes('.')) {
        next(new AppError(404, 'Not found', 'NOT_FOUND'));
        return;
      }
      const indexHtml = path.join(adminStaticDir, 'index.html');
      if (!existsSync(indexHtml)) {
        next();
        return;
      }
      res.sendFile(indexHtml);
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
