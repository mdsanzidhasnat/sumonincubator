import { z } from 'zod';

export const trackEventSchema = z.object({
  body: z.object({
    sessionId: z.string().trim().min(1).max(200),
    path: z.string().trim().min(1).max(500),
    title: z.string().trim().max(500).default(''),
    referrer: z.string().trim().max(1000).default(''),
  }),
});

const listEventsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  path: z.string().trim().max(500).optional(),
  deviceType: z.string().trim().max(50).optional(),
});

export const listEventsSchema = z.object({
  query: listEventsQuerySchema,
});
