import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const useAnalytics = () => {
  const trackPageView = (path: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-MH6E1E4HKX', {
        page_path: path,
      });
    }
  };

  const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', eventName, eventParams);
    }
  };

  return {
    trackPageView,
    trackEvent,
  };
}; 