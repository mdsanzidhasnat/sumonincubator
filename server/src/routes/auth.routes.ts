import { Router } from 'express';
import { z } from 'zod';

import type { Request, Response } from 'express';
import { env } from '../config/env.js';
import { adminAuthService } from '../services/admin-auth.service.js';
import { validate } from '../middlewares/validate.js';

const loginBodySchema = z.object({
  body: z.object({
    username: z.string().min(1),
    password: z.string().min(1),
  }),
});

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

function setAuthCookie(res: Response, req: Request, token: string): void {
  const secure = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'Secure; ' : '';
  const cookie = [
    `${env.AUTH_COOKIE_NAME}=${token}`,
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${env.AUTH_SESSION_TTL_SECONDS}`,
    'Path=/',
    secure,
  ].join('; ');
  res.setHeader('Set-Cookie', cookie);
}

function clearAuthCookie(res: Response): void {
  const cookie = [
    `${env.AUTH_COOKIE_NAME}=`,
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
    'Path=/',
  ].join('; ');
  res.setHeader('Set-Cookie', cookie);
}

export function authRoutes(): Router {
  const router = Router();

  router.post('/login', validate(loginBodySchema), async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const { token } = await adminAuthService.login(username, password);
      setAuthCookie(res, req, token);
      res.status(200).json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  router.post('/logout', (_req, res) => {
    clearAuthCookie(res);
    res.status(200).json({ ok: true });
  });

  router.get('/me', async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies[env.AUTH_COOKIE_NAME];
    if (!token) {
      res.status(200).json({ authenticated: false });
      return;
    }
    try {
      const payload = await adminAuthService.verify(token);
      res.status(200).json({ authenticated: true, username: payload.sub });
    } catch {
      res.status(200).json({ authenticated: false });
    }
  });

  return router;
}