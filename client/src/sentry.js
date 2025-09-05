import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN || "YOUR_SENTRY_DSN_HERE",
  environment: process.env.NODE_ENV,
  integrations: [
    new Integrations.BrowserTracing(),
  ],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  beforeSend(event) {
    // Filter out non-critical errors in production
    if (process.env.NODE_ENV === 'production') {
      // Don't send network errors or common browser issues
      if (event.exception) {
        const error = event.exception.values[0];
        if (error.type === 'NetworkError' || 
            error.value?.includes('ResizeObserver loop limit exceeded') ||
            error.value?.includes('Non-Error promise rejection')) {
          return null;
        }
      }
    }
    return event;
  },
});

export default Sentry;
