import express, { Router } from "express";
import {
  createTicket,
  deleteTicket,
  getAdminTickets,
  getPublicTickets,
  updateTicket,
} from "src/controllers/ticket.controller.js";
import { requireAuth } from "src/lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "src/lib/middlewares/required-event-role.middleware.js";
import { validate } from "src/lib/middlewares/validate.middleware.js";
import {
  CreateTicketSchema,
  UpdateTicketSchema,
} from "src/lib/validators/ticket.schema.js";

const router: Router = express.Router();

// Public listing (no auth)
router.get("/", getPublicTickets);

// Admin listing (auth)
router.get(
  "/admin",
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  getAdminTickets,
);

router.post(
  "/",
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  validate(CreateTicketSchema),
  createTicket,
);

router.patch(
  "/:ticketId",
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  validate(UpdateTicketSchema),
  updateTicket,
);

router.delete(
  "/:ticketId",
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  deleteTicket,
);

export default router;
