import express, { Router } from 'express';
import { requireAuth } from '@/middleware/require-auth.js';
import { handleGetProfile } from '@/controllers/user.controller.js';

const router: Router = express.Router();

router.get('/me', requireAuth, handleGetProfile);

export default router;
