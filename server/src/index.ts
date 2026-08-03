import 'dotenv/config';

import type { Server } from 'node:http';
import { pathToFileURL } from 'node:url';

import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDb, disconnectDb } from './config/db.js';
import { ProductRepository } from './repositories/product.repository.js';
import { ProductService } from './services/product.service.js';
import { ProductController } from './controllers/product.controller.js';
import { UploadController } from './controllers/upload.controller.js';
import { BulkImportService } from './services/bulk-import.service.js';
import { BulkImportController } from './controllers/bulk-import.controller.js';
import { CategoryController } from './controllers/category.controller.js';
import { SettingsController } from './controllers/settings.controller.js';
import { OrderController } from './controllers/order.controller.js';
import { OrderService } from './services/order.service.js';
import { SteadfastService } from './services/steadfast.service.js';
import { AnalyticsController } from './controllers/analytics.controller.js';
import { AnalyticsService } from './services/analytics.service.js';

export async function start(): Promise<void> {
  await connectDb();

  const repository = new ProductRepository();
  const service = new ProductService(repository);
  const productController = new ProductController(service);
  const uploadController = new UploadController();
  const bulkImportController = new BulkImportController(new BulkImportService(repository));
  const categoryController = new CategoryController();
  const settingsController = new SettingsController();
  const steadfastService = new SteadfastService();
  const orderController = new OrderController(new OrderService(steadfastService));
  const analyticsController = new AnalyticsController(new AnalyticsService());

  const app = await createApp({
    productController,
    uploadController,
    bulkImportController,
    categoryController,
    settingsController,
    orderController,
    analyticsController,
  });

  await new Promise<void>((resolve, reject) => {
    const server = app.listen(env.PORT);
    server.once('listening', () => {
      console.log(`sumonincubator-api listening on :${env.PORT}`);
      registerShutdown(server);
      resolve();
    });
    server.once('error', reject);
  });
}

function registerShutdown(server: Server): void {
  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.on(signal, async () => {
      console.log(`${signal} received, shutting down`);
      server.close();
      await disconnectDb();
      process.exit(0);
    });
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  start().catch((err) => {
    console.error('Fatal startup error', err);
    process.exit(1);
  });
}
