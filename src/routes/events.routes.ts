import express, { Router } from 'express';
import { requireAuth } from '@/middleware/require-auth.js';
import { CreateEventSchema } from '@/utils/validators/event.schema.js';
import { createEvent } from '@/controllers/events.controller.js';
import { validate } from '@/middleware/validate.js';

const router: Router = express.Router();

router.post(
    '/',
    requireAuth,
    validate(CreateEventSchema),
    createEvent
  );

export default router;
