import React, { createContext, useContext, useEffect, useState } from 'react';

import { API_BASE } from '../lib/api';

export interface BrandSettings {
  logoUrl: string;
  brandName: string;
}

export const defaultBrandSettings: BrandSettings = {
  logoUrl: '',
  brandName: "Sumon's World",
};

const BrandSettingsContext = createContext<BrandSettings>(defaultBrandSettings);

export const BrandSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<BrandSettings>(defaultBrandSettings);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let timer: number | undefined;

    const load = () => {
      fetch(`${API_BASE}/api/v1/settings/brand`, { credentials: 'same-origin' })
        .then((response) => (response.ok ? response.json() : null))
        .then((data: Partial<BrandSettings> | null) => {
          if (cancelled) return;
          if (data && typeof data === 'object') {
            setSettings({ ...defaultBrandSettings, ...data });
          } else if (attempts < 3) {
            attempts += 1;
            timer = window.setTimeout(load, 1500 * attempts);
          }
        })
        .catch(() => {
          if (!cancelled && attempts < 3) {
            attempts += 1;
            timer = window.setTimeout(load, 1500 * attempts);
          }
        });
    };

    load();

    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  return (
    <BrandSettingsContext.Provider value={settings}>
      {children}
    </BrandSettingsContext.Provider>
  );
};

export const useBrandSettings = (): BrandSettings => useContext(BrandSettingsContext);

export const splitBrandName = (name: string): { first: string; last: string } => {
  const trimmed = name.trim();
  const lastSpace = trimmed.lastIndexOf(' ');
  if (lastSpace > 0) {
    return {
      first: trimmed.slice(0, lastSpace),
      last: trimmed.slice(lastSpace + 1),
    };
  }
  return { first: trimmed, last: '' };
};
