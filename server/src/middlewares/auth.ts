import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { env } from '../config/env.js';
import { AppError } from '../errors/app-error.js';
import { adminAuthService } from '../services/admin-auth.service.js';

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach((pair) => {
    const parts = pair.split('=');
    const name = parts[0];
    if (!name) return;
    cookies[name.trim()] = decodeURIComponent(parts.slice(1).join('=').trim());
  });
  return cookies;
}

export function requireAdmin(): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookies = parseCookies(req.headers.cookie);
      const token = cookies[env.AUTH_COOKIE_NAME];
      if (!token) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }
      const payload = await adminAuthService.verify(token);
      (req as Request & { admin: { sub: string } }).admin = payload;
      next();
    } catch (err) {
      next(err);
    }
  };
}