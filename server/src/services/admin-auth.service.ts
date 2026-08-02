import { randomBytes, timingSafeEqual } from 'node:crypto';

import bcrypt from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';

import { AppError } from '../errors/app-error.js';
import { env } from '../config/env.js';

const DUMMY_HASH = '$2b$10$XaaGCXZHnYQg96fEaeuWkOP2kKEts5NKXYJ9OET.NNyFLbeSvZkWm';

export class AdminAuthService {
  async login(username: string, password: string): Promise<{ token: string }> {
    const expectedUsername = env.ADMIN_USERNAME;

    const hash =
      username === expectedUsername
        ? env.ADMIN_PASSWORD_HASH
        : DUMMY_HASH;

    const match = await bcrypt.compare(password, hash);

    if (!match || username !== expectedUsername) {
      throw new AppError(401, 'Invalid username or password', 'INVALID_CREDENTIALS');
    }

    const secret = new TextEncoder().encode(env.AUTH_JWT_SECRET);
    const token = await new SignJWT({ sub: username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${env.AUTH_SESSION_TTL_SECONDS}s`)
      .sign(secret);

    return { token };
  }

  async verify(token: string): Promise<{ sub: string }> {
    const secret = new TextEncoder().encode(env.AUTH_JWT_SECRET);
    try {
      const { payload } = await jwtVerify(token, secret);
      return payload as { sub: string };
    } catch {
      throw new AppError(401, 'Session expired or invalid', 'UNAUTHORIZED');
    }
  }
}

export const adminAuthService = new AdminAuthService();