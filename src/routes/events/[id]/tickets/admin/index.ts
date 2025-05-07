import type { Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "@/lib/middlewares/required-event-role.middleware.js";
import * as ticketService from "@/services/ticket.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";
import { z } from "zod";
import { logger } from "@/lib/utils.js";

const logError = logger.extend("tickets:admin:error");
const paramsSchema = z.object({ id: z.string().uuid() });

/**
 * GET /events/:id/tickets/admin
 * Admin listing: ticket types with their orders and tickets.
 */
export const GET: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  async (req: ExtendedRequest, res: Response) => {
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid event ID" });
      return;
    }
    const eventId = parsed.data.id;

    try {
      const tickets = await ticketService.getAdminTicketTypes(
        eventId,
        req.userId,
      );
      res.status(200).json(tickets);
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        logError("[GET /events/:id/tickets/admin] Unexpected error: %O", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
