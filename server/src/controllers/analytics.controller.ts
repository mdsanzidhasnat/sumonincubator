import type { Request, Response } from 'express';

import type { AnalyticsService, AnalyticsListInput } from '../services/analytics.service.js';
import { asyncHandler } from '../middlewares/error.js';

function clientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return req.ip ?? '';
}

export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  track = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId, path, title, referrer } = req.body as {
      sessionId: string;
      path: string;
      title?: string;
      referrer?: string;
    };

    await this.service.track({
      sessionId,
      path,
      title,
      referrer,
      ip: clientIp(req),
      userAgent: req.headers['user-agent'] ?? 'unknown',
    });

    res.status(204).send();
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const raw = req.query as unknown as Record<string, string | undefined>;
    const input: AnalyticsListInput = {
      page: raw.page ? Number(raw.page) : undefined,
      limit: raw.limit ? Number(raw.limit) : undefined,
      path: raw.path,
      deviceType: raw.deviceType,
    };
    const result = await this.service.listEvents(input);

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(result);
  });

  stats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await this.service.getStats();

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(stats);
  });
}
