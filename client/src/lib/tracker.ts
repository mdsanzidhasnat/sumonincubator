import { API_BASE } from './api';

const SESSION_KEY = 'sumon_session_id';
const DEDUPE_MS = 2000;

function getOrCreateSessionId(): string {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  localStorage.setItem(SESSION_KEY, id);
  return id;
}

export function trackPageView(path: string, title: string, referrer: string): void {
  if (!path) return;

  const dedupeKey = `${path}`;
  const last = (sessionStorage.getItem(dedupeKey) as unknown) as { at?: number } | null;
  const now = Date.now();
  if (last && now - (last.at ?? 0) < DEDUPE_MS) {
    return;
  }
  sessionStorage.setItem(dedupeKey, JSON.stringify({ at: now }));

  const payload = JSON.stringify({
    sessionId: getOrCreateSessionId(),
    path,
    title,
    referrer,
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      if (navigator.sendBeacon(`${API_BASE}/api/v1/analytics/track`, blob)) {
        return;
      }
    }
  } catch {
    /* fall through to fetch */
  }

  fetch(`${API_BASE}/api/v1/analytics/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    credentials: 'same-origin',
    keepalive: true,
  }).catch(() => {
    /* silent — analytics must never break the page */
  });
}
