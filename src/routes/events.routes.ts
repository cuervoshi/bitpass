import express, { Router } from "express";
import { requireAuth } from "../lib/middlewares/require-auth.middleware.js";
import { CreateEventSchema } from "../lib/validators/event.schema.js";
import { createEvent } from "../controllers/events.controller.js";
import { validate } from "../lib/middlewares/validate.middleware.js";

const router: Router = express.Router();

router.post("/", requireAuth, validate(CreateEventSchema), createEvent);

export default router;
