import express, { Application } from "express";
import { logger } from "./lib/middlewares/logger.middleware.js";
import { errorHandler } from "./lib/middlewares/error-handler.middleware.js";

import healthRouter from "./routes/health.routes.js";
import authRouter from "./routes/auth.routes.js";
import usersRouter from "./routes/user.routes.js";
import eventsRouter from "./routes/events.routes.js";

const createApp = (): Application => {
  const app: Application = express();

  // Middleware
  app.use(express.json());
  app.use(logger);

  // Routes
  app.use("/health", healthRouter);
  app.use("/auth", authRouter);
  app.use("/users", usersRouter);
  app.use("/events", eventsRouter);

  // 404 handler for undefined routes
  app.use((req, res) => {
    res.status(404).json({
      status: "error",
      message: "Route not found",
      timestamp: new Date().toISOString(),
    });
  });

  // Error handling middleware (should be last)
  app.use(errorHandler);

  return app;
};

export default createApp;
