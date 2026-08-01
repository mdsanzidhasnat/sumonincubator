import type { Request, Response } from 'express';

import { ProductService, type ProductListInput } from '../services/product.service.js';
import { asyncHandler } from '../middlewares/error.js';

export class ProductController {
  constructor(private readonly service: ProductService) {}

  list = asyncHandler(async (req: Request, res: Response) => {
    const raw = req.query as unknown as Record<string, string | undefined>;
    const input: ProductListInput = {
      categoryKey: raw.category,
      q: raw.q,
      sort: raw.sort as ProductListInput['sort'],
      bestseller: raw.bestseller === 'true',
      featured: raw.featured === 'true',
      page: raw.page ? Number(raw.page) : undefined,
      limit: raw.limit ? Number(raw.limit) : undefined,
    };
    const result = await this.service.list(input);

    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    res.status(200).json(result);
  });

  stats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await this.service.getStats();

    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    res.status(200).json(stats);
  });

  get = asyncHandler(async (req: Request, res: Response) => {
    const { slugOrId } = req.params as { slugOrId: string };
    const product = await this.service.getBySlugOrId(slugOrId);

    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).json(product);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const product = await this.service.create(req.body);
    res.status(201).json(product);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const product = await this.service.update(id, req.body);
    res.status(200).json(product);
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await this.service.remove(id);
    res.status(204).send();
  });
}
