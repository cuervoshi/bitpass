import express, { Router } from "express";
import { createTicket } from "src/controllers/tickets.controller.js";
import { requireAuth } from "src/lib/middlewares/require-auth.middleware.js";
import { validate } from "src/lib/middlewares/validate.middleware.js";
import { CreateTicketSchema } from "src/lib/validators/ticket.schema.js";

const router: Router = express.Router();

router.post("/", requireAuth, validate(CreateTicketSchema), createTicket);

// router.get("/", getTickets);
// router.patch("/:ticketId", requireAuth, updateTicket);
// router.delete("/:ticketId", requireAuth, deleteTicket);

export default router;
