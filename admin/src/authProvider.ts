import type { AuthProvider } from 'react-admin';

const apiBase = '';

interface MeResponse {
  authenticated: boolean;
  username?: string;
}

interface ErrorBody {
  error?: { code?: string; message?: string };
  message?: string;
}

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const json = (await response.json().catch(() => ({}))) as T & ErrorBody;
  if (!response.ok) {
    const error = new Error(json?.error?.message ?? json?.message ?? 'Request failed') as Error & {
      status?: number;
    };
    error.status = response.status;
    throw error;
  }
  return json;
}

export const authProvider: AuthProvider = {
  async login({ username, password }) {
    await api('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async logout() {
    await api('/api/v1/auth/logout', { method: 'POST' }).catch(() => undefined);
    return '/admin';
  },

  async checkAuth() {
    const me = await api<MeResponse>('/api/v1/auth/me');
    if (!me.authenticated) {
      throw new Error('Not authenticated');
    }
  },

  async checkError(error) {
    const status = (error as { status?: number } | undefined)?.status;
    if (status === 401 || status === 403) {
      throw new Error('Session expired — please sign in again.');
    }
  },

  async getIdentity() {
    const me = await api<MeResponse>('/api/v1/auth/me');
    if (!me.authenticated) {
      throw new Error('Not authenticated');
    }
    return { id: me.username ?? 'admin', fullName: me.username ?? 'Admin' };
  },

  async getPermissions() {
    return ['admin'];
  },
};
