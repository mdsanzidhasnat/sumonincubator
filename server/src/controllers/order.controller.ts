import type { Request, Response } from 'express';

import type { OrderService, OrderListInput } from '../services/order.service.js';
import { asyncHandler } from '../middlewares/error.js';

export class OrderController {
  constructor(private readonly service: OrderService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const order = await this.service.createOrder(req.body);
    res.status(201).json(order);
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const raw = req.query as unknown as Record<string, string | undefined>;
    const input: OrderListInput = {
      q: raw.q,
      status: raw.status as OrderListInput['status'],
      page: raw.page ? Number(raw.page) : undefined,
      limit: raw.limit ? Number(raw.limit) : undefined,
    };
    const result = await this.service.listOrders(input);

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(result);
  });

  get = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const order = await this.service.getOrder(id);

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(order);
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { status } = req.body as { status: 'pending' | 'confirmed' | 'delivered' | 'cancelled' | 'returned' };
    const order = await this.service.updateStatus(id, status);

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(order);
  });

  retryCourier = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const order = await this.service.retryCourier(id);

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(order);
  });

  stats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await this.service.getStats();

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(stats);
  });
}
