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
    fetch(`${API_BASE}/api/v1/settings/contact`, { credentials: 'same-origin' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: Partial<ContactSettings> | null) => {
        if (data && !cancelled) {
          setSettings({ ...defaultContactSettings, ...data });
        }
      })
      .catch(() => {
        // Keep built-in defaults when the API is unreachable.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ContactSettingsContext.Provider value={settings}>
      {children}
    </ContactSettingsContext.Provider>
  );
};

export const useContactSettings = (): ContactSettings => useContext(ContactSettingsContext);
