import React, { createContext, useContext, useEffect, useState } from 'react';

import { API_BASE } from '../lib/api';
import { CONTACT } from '../data/contact';

export interface ContactSettings {
  phone: string;
  phoneDisplay: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  messengerPageId: string;
  messengerPageUrl: string;
}

export const defaultContactSettings: ContactSettings = {
  phone: CONTACT.phone,
  phoneDisplay: CONTACT.phoneDisplay,
  whatsappNumber: CONTACT.whatsappNumber,
  whatsappDefaultMessage: CONTACT.whatsappDefaultMessage,
  messengerPageId: CONTACT.messengerPageId,
  messengerPageUrl: CONTACT.messengerPageUrl,
};

const ContactSettingsContext = createContext<ContactSettings>(defaultContactSettings);

export const ContactSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ContactSettings>(defaultContactSettings);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let timer: number | undefined;

    const load = () => {
      fetch(`${API_BASE}/api/v1/settings/contact`, { credentials: 'same-origin' })
        .then((response) => (response.ok ? response.json() : null))
        .then((data: Partial<ContactSettings> | null) => {
          if (cancelled) return;
          if (data && typeof data === 'object') {
            setSettings({ ...defaultContactSettings, ...data });
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
    <ContactSettingsContext.Provider value={settings}>
      {children}
    </ContactSettingsContext.Provider>
  );
};

export const useContactSettings = (): ContactSettings => useContext(ContactSettingsContext);
