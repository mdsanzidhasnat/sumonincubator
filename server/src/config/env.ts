import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  STUDIO_ENABLED: z
    .string()
    .default('true')
    .transform((v) => v === 'true')
    .refine((v) => process.env.NODE_ENV !== 'production' || v === false, {
      message: 'STUDIO_ENABLED must be false in production (Mongoose Studio has no auth)',
    }),
  STUDIO_PATH: z.string().default('/admin'),
  STUDIO_API_PATH: z.string().default('/admin/api'),
  STUDIO_BIND_IP: z.string().optional(),
});

export const env = envSchema.parse(process.env);

export const corsOrigins = env.CORS_ORIGINS.split(',').map((origin) => origin.trim());
