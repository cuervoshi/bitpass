import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "../../../../../lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "../../../../../lib/middlewares/required-event-role.middleware.js";
import { validate } from "../../../../../lib/middlewares/validate.middleware.js";
import {
  UpdateTicketSchema,
  type UpdateTicketInput,
} from "../../../../../lib/validators/ticket.schema.js";
import * as ticketService from "../../../../../services/ticket.service.js";

// PATCH /events/:id/tickets/:ticketId
export const PATCH: RequestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  validate(UpdateTicketSchema),
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId as string;
      const { id: eventId, ticketId } = req.params;
      const updated = await ticketService.updateTicketType(
        eventId,
        ticketId,
        userId,
        req.body,
      );
      res.status(200).json(updated);
    } catch (err: any) {
      if (err.status && err.message) {
        res.status(err.status).json({ error: err.message });
      } else {
        console.error(
          "[PATCH /events/:id/tickets/:ticketId] Unexpected error:",
          err,
        );
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];

// DELETE /events/:id/tickets/:ticketId
export const DEL: RequestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId as string;
      const { id: eventId, ticketId } = req.params;
      await ticketService.deleteTicketType(eventId, ticketId, userId);
      res.status(204).send();
    } catch (err: any) {
      if (err.status && err.message) {
        res.status(err.status).json({ error: err.message });
      } else {
        console.error(
          "[DELETE /events/:id/tickets/:ticketId] Unexpected error:",
          err,
        );
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
