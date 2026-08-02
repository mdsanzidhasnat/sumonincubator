import type { Request, Response } from 'express';

import { CategoryModel } from '../models/category.model.js';
import { asyncHandler } from '../middlewares/error.js';

export class CategoryController {
  list = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await CategoryModel.find().sort({ key: 1 }).lean();

    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    res.status(200).json(
      categories.map((c) => ({
        id: c._id.toString(),
        key: c.key,
        name: c.name,
        nameBn: c.nameBn,
        iconName: c.iconName,
        itemCount: c.itemCount,
      })),
    );
  });
}
