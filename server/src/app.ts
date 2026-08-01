import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import studio from '@mongoosejs/studio/express.js';

import { corsOrigins, env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/error.js';
import { productRoutes } from './routes/product.routes.js';
import type { ProductController } from './controllers/product.controller.js';

export interface AppDeps {
  productController: ProductController;
}

const studioStaticDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../public/studio',
);

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

  app.use('/api/v1/products', productRoutes(deps.productController));

  if (env.STUDIO_ENABLED) {
    const studioOptions = env.STUDIO_BIND_IP ? { bindIp: env.STUDIO_BIND_IP } : undefined;
    app.use(env.STUDIO_PATH, (_req, res, next) => {
      res.removeHeader('Content-Security-Policy');
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
