import express, { Router } from 'express';

import { handleGetProfile } from '../controllers/user/getUser.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router: Router = express.Router();

router.get('/me', requireAuth, handleGetProfile);

export default router;
