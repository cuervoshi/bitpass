import express, { Application } from 'express';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

const createApp = (): Application => {
  const app: Application = express();

  // Middleware
  app.use(express.json());
  app.use(logger);

  // Routes
  app.use('/health', healthRouter);
  app.use('/auth', authRouter);

  // 404 handler for undefined routes
  app.use((req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Route not found',
      timestamp: new Date().toISOString()
    });
  });

  // Error handling middleware (should be last)
  app.use(errorHandler);

  return app;
};

export default createApp;