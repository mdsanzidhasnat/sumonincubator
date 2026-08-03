import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { trackPageView } from '../lib/tracker';

export const VisitorTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const title = document.title;
    const referrer = document.referrer;
    trackPageView(location.pathname + location.search, title, referrer);
  }, [location]);

  return null;
};
