// Web Vitals monitoring
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';
import * as Sentry from '@sentry/react';

function sendToAnalytics(metric) {
  // Send to your analytics service
  // eslint-disable-next-line no-console
  console.log('Web Vital:', metric);
  
  // Example: Send to Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
  
  // Send to Sentry for monitoring
  Sentry.addBreadcrumb({
    category: 'web-vitals',
    message: `${metric.name}: ${metric.value}`,
    level: 'info',
  });
}

// Measure all Core Web Vitals (INP replaces FID in v3+)
onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onFCP(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);

export { sendToAnalytics };
