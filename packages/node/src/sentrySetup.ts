import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://aaacf174b7fbfdf836f2c3c2b95a4570@o4507377336254464.ingest.us.sentry.io/4507377340121088",
  integrations: [nodeProfilingIntegration()],

  // Add these
  environment: process.env.NODE_ENV || "development",
  enabled: process.env.NODE_ENV === "production",
  debug: process.env.NODE_ENV === "development",

  // Error Settings
  sampleRate: 1.0, // Capture all errors
  maxBreadcrumbs: 50, // Increase context for errors
  attachStacktrace: true, // Always attach stacktraces

  // Your existing performance settings
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

// Add global error handler
process.on("unhandledRejection", (err) => {
  Sentry.captureException(err);
});

process.on("uncaughtException", (err) => {
  Sentry.captureException(err);
});
