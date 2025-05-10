import express, { Application } from "express";
import { requestLogger } from "./lib/middlewares/logger.middleware.js";
import { errorHandler } from "./lib/middlewares/error-handler.middleware.js";

import { router } from "express-file-routing";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createApp = async (): Promise<Application> => {
  const app: Application = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.use("/", await router({ directory: path.join(__dirname, "routes") }));

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
