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

export async function start(): Promise<void> {
  await connectDb();

  const repository = new ProductRepository();
  const service = new ProductService(repository);
  const productController = new ProductController(service);
  const uploadController = new UploadController();

  const app = await createApp({ productController, uploadController });

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
