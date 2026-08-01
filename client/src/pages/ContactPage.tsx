import React from 'react';
import { AboutContactViews } from '../components/AboutContactViews';
import { useApp } from '../context/AppContext';

export const ContactPage: React.FC = () => {
  const { lang } = useApp();
  return <AboutContactViews view="contact" lang={lang} />;
};
