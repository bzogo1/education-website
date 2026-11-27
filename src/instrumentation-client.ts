import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Enables Tracing.
  // Capture 100% in dev, 10% in production
  // Adjust based on your traffic volume
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
  integrations: [
    // enables Session Replay
    Sentry.replayIntegration(),
    // enables User Feedback
    Sentry.feedbackIntegration({
      // Additional integration configuration goes in here
      colorScheme: 'system',
    }),
  ],

  // Capture replays for 10% of all sessions,
  // plus for 100% of sessions with an error
  // Requires Sentry.replayIntegration()
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
