import { randomUUID } from 'node:crypto';

import type { Request, Response } from 'express';
import mongoose from 'mongoose';

import { AppError } from '../errors/app-error.js';
import { asyncHandler } from '../middlewares/error.js';

const BUCKET_NAME = 'productImages';

const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

export class UploadController {
  private bucket(): mongoose.mongo.GridFSBucket {
    const db = mongoose.connection.db;
    if (!db) {
      throw new AppError(500, 'Database connection not ready', 'DB_NOT_CONNECTED');
    }
    return new mongoose.mongo.GridFSBucket(db, { bucketName: BUCKET_NAME });
  }

  private static async store(
    bucket: mongoose.mongo.GridFSBucket,
    buffer: Buffer,
    contentType: string,
  ): Promise<mongoose.Types.ObjectId> {
    const ext = EXT_BY_TYPE[contentType] ?? '';
    const filename = `${randomUUID()}${ext}`;
    return await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
      const stream = bucket.openUploadStream(filename, { metadata: { contentType } });
      stream.on('error', reject);
      stream.on('finish', () => resolve(stream.id));
      stream.end(buffer);
    });
  }

  create = asyncHandler(async (req: Request, res: Response) => {
    const files = Array.isArray(req.files) ? (req.files as Express.Multer.File[]) : [];
    if (files.length === 0) {
      throw new AppError(400, 'No image files received (field name: images)', 'NO_FILES');
    }

    const bucket = this.bucket();
    const ids: mongoose.Types.ObjectId[] = [];
    for (const file of files) {
      ids.push(await UploadController.store(bucket, file.buffer, file.mimetype));
    }

    const base = `${req.protocol}://${req.get('host')}`;
    res.status(201).json({
      urls: ids.map((id) => `${base}/api/v1/uploads/products/${id.toString()}`),
    });
  });

  get = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, 'Invalid image id', 'INVALID_IMAGE_ID');
    }

    const bucket = this.bucket();
    const [file] = await bucket
      .find({ _id: new mongoose.Types.ObjectId(id) })
      .limit(1)
      .toArray();
    if (!file) {
      throw new AppError(404, 'Image not found', 'IMAGE_NOT_FOUND');
    }

    res.setHeader(
      'Content-Type',
      file.metadata?.contentType ?? 'application/octet-stream',
    );
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');

    bucket.openDownloadStream(file._id).on('error', (err) => {
      if (!res.headersSent) {
        console.error('Image stream error', err);
        res.status(404).json({ error: { code: 'IMAGE_NOT_FOUND', message: 'Image not found' } });
      } else {
        res.end();
      }
    }).pipe(res);
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, 'Invalid image id', 'INVALID_IMAGE_ID');
    }

    const bucket = this.bucket();
    const objectId = new mongoose.Types.ObjectId(id);
    const [file] = await bucket.find({ _id: objectId }).limit(1).toArray();
    if (!file) {
      throw new AppError(404, 'Image not found', 'IMAGE_NOT_FOUND');
    }

    await bucket.delete(objectId);
    res.status(204).send();
  });
}
