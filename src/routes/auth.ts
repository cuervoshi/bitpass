import express, { Router } from 'express';

import { handleRequestOtp } from '../controllers/auth/requestOtp.js';
import { handleVerifyOtp } from '../controllers/auth/verifyOtp.js';
import { handleVerifyNostr } from '../controllers/auth/verifyNostr.js';
import { handleGetProfile } from '../controllers/auth/getProfile.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router: Router = express.Router();

router.post('/request-otp', handleRequestOtp);
router.post('/verify-otp', handleVerifyOtp);

router.post('/verify-nostr', handleVerifyNostr);

router.get('/profile', requireAuth, handleGetProfile);

export default router;
