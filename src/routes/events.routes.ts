import express, { Router } from "express";
import { requireAuth } from "../lib/middlewares/require-auth.middleware.js";
import {
  CreateEventSchema,
  UpdateEventSchema,
} from "../lib/validators/event.schema.js";
import {
  createEvent,
  deleteEvent,
  getDraftEvent,
  updateEvent,
} from "../controllers/event.controller.js";
import { validate } from "../lib/middlewares/validate.middleware.js";
import ticketsRouter from "./tickets.routes.js";

const router: Router = express.Router();

router.post("/", requireAuth, validate(CreateEventSchema), createEvent);
router.get("/:id/edit", requireAuth, getDraftEvent);
router.patch("/:id", requireAuth, validate(UpdateEventSchema), updateEvent);
router.delete("/:id", requireAuth, deleteEvent);

// router for events/:id/tickets
router.use("/:id/tickets", ticketsRouter);

export default router;
