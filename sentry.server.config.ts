// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://7846cc2c6775c3de732eb292454677b2@o4510379702747136.ingest.us.sentry.io/4510379717951488",
    integrations: [
        // Add the Vercel AI SDK integration to sentry.server.config.ts
        Sentry.vercelAIIntegration({
            recordInputs: true,
            recordOutputs: true,
        }),
        Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
    ],

// Tracing must be enabled for agent monitoring to work
    tracesSampleRate: 1.0,
    sendDefaultPii: true,

  // Enable logs to be sent to Sentry
    enableLogs: true,


});
