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
  handlePublishEvent,
  updateEvent,
} from "../controllers/event.controller.js";
import { validate } from "../lib/middlewares/validate.middleware.js";
import ticketsRouter from "./tickets.routes.js";
import discountRouter from "./discount.routes.js";
import { requireEventRole } from "src/lib/middlewares/required-event-role.middleware.js";

const router: Router = express.Router();

router.post("/", requireAuth, validate(CreateEventSchema), createEvent);

router.get(
  "/:id/edit",
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR", "COLLABORATOR"]),
  getDraftEvent,
);

router.patch(
  "/:id",
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  validate(UpdateEventSchema),
  updateEvent,
);

router.delete("/:id", requireAuth, requireEventRole(["OWNER"]), deleteEvent);

router.patch(
  "/:id/publish",
  requireAuth,
  requireEventRole(["OWNER"]),
  handlePublishEvent,
);

// router for events/:id/tickets
router.use("/:id/tickets", ticketsRouter);

// router for events/:id/discount-codes
router.use("/:id/discount-codes", discountRouter);

export default router;
