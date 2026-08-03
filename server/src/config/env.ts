import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  ADMIN_ENABLED: z
    .string()
    .default('true')
    .transform((v) => v === 'true'),
  ADMIN_PATH: z.string().default('/admin'),
  ADMIN_USERNAME: z.string().default('admin'),
  ADMIN_PASSWORD_HASH: z.string().min(1),
  AUTH_JWT_SECRET: z.string().min(32),
  AUTH_COOKIE_NAME: z.string().default('si_admin'),
  AUTH_SESSION_TTL_SECONDS: z.coerce.number().int().positive().default(43200),
  STEADFAST_API_KEY: z.string().optional(),
  STEADFAST_SECRET_KEY: z.string().optional(),
  STEADFAST_BASE_URL: z.string().default('https://portal.packzy.com/api/v1'),
});

export const env = envSchema.parse(process.env);

export const corsOrigins = env.CORS_ORIGINS.split(',').map((origin) => origin.trim());
