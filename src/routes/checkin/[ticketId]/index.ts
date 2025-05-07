import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "@/lib/middlewares/required-event-role.middleware.js";
import { getTicketInfo } from "@/services/ticket.service.js";
import { z } from "zod";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";

/**
 * GET /checkin/:ticketId
 * Requires authentication and event role (OWNER, MODERATOR, COLLABORATOR).
 */
export const GET: RestHandler[] = [
  requireAuth,
  async (req: ExtendedRequest, res: Response) => {
    const paramsSchema = z.object({ ticketId: z.string().uuid() });
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid ticket ID" });
      return;
    }

    try {
      const ticket = await getTicketInfo(
        parsed.data.ticketId,
        req.userId as string,
      );
      res.status(200).json(ticket);
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        console.error("[GET /checkin/:ticketId] Unexpected error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
