import type { Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "@/lib/middlewares/required-event-role.middleware.js";
import { validate } from "@/lib/middlewares/validate.middleware.js";
import { UpdateTicketSchema } from "@/lib/validators/ticket.schema.js";
import * as ticketService from "@/services/ticket.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";
import { z } from "zod";
import { logger } from "@/lib/utils.js";

const logError = logger.extend("tickets:handler:error");
const paramsSchema = z.object({
  id: z.string().uuid(),
  ticketId: z.string().uuid(),
});

/**
 * PATCH /events/:id/tickets/:ticketId
 * Updates a ticket type under a draft event.
 */
export const PATCH: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  validate(UpdateTicketSchema),
  async (req: ExtendedRequest, res: Response) => {
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid event ID or ticket ID" });
      return;
    }
    const { id: eventId, ticketId } = parsed.data;

    try {
      const updated = await ticketService.updateTicketType(
        eventId,
        ticketId,
        req.userId,
        req.body,
      );
      res.status(200).json(updated);
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        logError(
          "[PATCH /events/:id/tickets/:ticketId] Unexpected error: %O",
          err,
        );
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];

/**
 * DELETE /events/:id/tickets/:ticketId
 * Deletes a ticket type under a draft event.
 */
export const DEL: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  async (req: ExtendedRequest, res: Response) => {
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid event ID or ticket ID" });
      return;
    }
    const { id: eventId, ticketId } = parsed.data;

    try {
      await ticketService.deleteTicketType(eventId, ticketId, req.userId);
      res.status(204).send();
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        logError(
          "[DELETE /events/:id/tickets/:ticketId] Unexpected error: %O",
          err,
        );
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
