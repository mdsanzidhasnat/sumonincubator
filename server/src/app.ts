import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express, { type Express, type Request } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import studio from '@mongoosejs/studio/express.js';

import { corsOrigins, env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/error.js';
import { productRoutes } from './routes/product.routes.js';
import { uploadRoutes } from './routes/upload.routes.js';
import type { ProductController } from './controllers/product.controller.js';
import type { UploadController } from './controllers/upload.controller.js';
import type { BulkImportController } from './controllers/bulk-import.controller.js';

export interface AppDeps {
  productController: ProductController;
  uploadController: UploadController;
  bulkImportController: BulkImportController;
}

const studioStaticDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../public/studio',
);

function normalizeStudioModelParam(req: Request): void {
  const models = Object.keys(mongoose.models);
  if (models.length === 0) {
    return;
  }
  const fix = (value: unknown): unknown => {
    if (typeof value !== 'string') {
      return value;
    }
    const match = models.find((name) => name.toLowerCase() === value.toLowerCase());
    return match ?? value;
  };

  const originalQuery = req.query;
  const hasQueryModel = typeof originalQuery?.model === 'string';
  const body = req.body as Record<string, unknown> | undefined;
  const hasBodyModel = body != null && typeof body === 'object' && typeof body.model === 'string';
  if (!hasQueryModel && !hasBodyModel) {
    return;
  }

  if (hasQueryModel) {
    const normalized = { ...originalQuery, model: fix(originalQuery.model) };
    Object.defineProperty(req, 'query', {
      configurable: true,
      enumerable: true,
      get: () => normalized,
    });
  }
  if (hasBodyModel) {
    body.model = fix(body.model);
  }
}

export async function createApp(deps: AppDeps): Promise<Express> {
  const app = express();
  app.disable('x-powered-by');

  app.use(helmet());
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

  app.use(
    '/api/v1/products',
    productRoutes(deps.productController, deps.bulkImportController),
  );
  app.use('/api/v1/uploads', uploadRoutes(deps.uploadController, env.STUDIO_ENABLED));

  if (env.STUDIO_ENABLED) {
    const studioOptions = env.STUDIO_BIND_IP ? { bindIp: env.STUDIO_BIND_IP } : undefined;
    app.use(env.STUDIO_PATH, (req, res, next) => {
      res.removeHeader('Content-Security-Policy');
      if (req.path === '/' || req.path === '') {
        res.redirect(302, `${env.STUDIO_PATH}/dashboard.html`);
        return;
      }
      normalizeStudioModelParam(req);
      next();
    });
    app.use(env.STUDIO_PATH, express.static(studioStaticDir));
    app.use(
      env.STUDIO_PATH,
      await studio(env.STUDIO_API_PATH, mongoose, studioOptions),
    );
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
