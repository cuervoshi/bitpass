// src/routes/events/tickets.ts
import type { Request, Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "@/lib/middlewares/required-event-role.middleware.js";
import { validate } from "@/lib/middlewares/validate.middleware.js";
import { CreateTicketSchema } from "@/lib/validators/ticket.schema.js";
import * as ticketService from "@/services/ticket.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";
import { z } from "zod";
import { logger } from "@/lib/utils.js";

const logError = logger.extend("tickets:handler:error");
const paramsSchema = z.object({ id: z.string().uuid() });

/**
 * GET /events/:id/tickets
 * Public listing: ticket types of a PUBLISHED event with sold and available counts.
 */
export const GET: RestHandler[] = [
  // No auth required
  async (req: ExtendedRequest, res: Response) => {
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid event ID" });
      return;
    }
    const eventId = parsed.data.id;

    try {
      const tickets = await ticketService.getPublicTicketTypes(eventId);
      res.status(200).json(tickets);
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        logError("[GET /events/:id/tickets] Unexpected error: %O", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];

/**
 * POST /events/:id/tickets
 * Create a new ticket type under a draft event.
 */
export const POST: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  validate(CreateTicketSchema),
  async (req: ExtendedRequest, res: Response) => {
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid event ID" });
      return;
    }
    const eventId = parsed.data.id;

    try {
      const ticket = await ticketService.createTicketType(
        eventId,
        req.userId,
        req.body,
      );
      res.status(201).json(ticket);
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        logError("[POST /events/:id/tickets] Unexpected error: %O", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
