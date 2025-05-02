
import { HealthResponse } from '../types/index.js';
import { getVersion } from '../utils/appInfo.js';
import { Request, Response, Router, type Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();

router.get('/', (req: Request, res: Response) => {
  const healthResponse: HealthResponse = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: getVersion(),
    environment: process.env.NODE_ENV || 'development'
  };
  
  res.status(200).json(healthResponse).send();
});

export default router;