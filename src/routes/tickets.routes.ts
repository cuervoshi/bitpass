import express, { Router } from "express";
import {
  createTicket,
  deleteTicket,
  updateTicket,
} from "src/controllers/ticket.controller.js";
import { requireAuth } from "src/lib/middlewares/require-auth.middleware.js";
import { validate } from "src/lib/middlewares/validate.middleware.js";
import {
  CreateTicketSchema,
  UpdateTicketSchema,
} from "src/lib/validators/ticket.schema.js";

const router: Router = express.Router();

router.post("/", requireAuth, validate(CreateTicketSchema), createTicket);

router.patch(
  "/:ticketId",
  requireAuth,
  validate(UpdateTicketSchema),
  updateTicket,
);

router.delete("/:ticketId", requireAuth, deleteTicket);

export default router;
