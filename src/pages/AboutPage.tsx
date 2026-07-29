import React from 'react';
import { AboutContactViews } from '../components/AboutContactViews';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const { lang } = useApp();
  return <AboutContactViews view="about" lang={lang} />;
};
