import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

import { AppError } from '../errors/app-error.js';

interface RequestSchema {
  body?: unknown;
  query?: unknown;
  params?: unknown;
}

export function validate<T extends ZodType<RequestSchema>>(schema: T): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const issue = result.error.issues[0];
      next(
        new AppError(
          400,
          issue?.message ?? 'Invalid request',
          'VALIDATION_ERROR',
          result.error.flatten(),
        ),
      );
      return;
    }

    next();
  };
}
