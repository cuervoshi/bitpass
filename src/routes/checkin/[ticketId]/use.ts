import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "../../../lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "../../../lib/middlewares/required-event-role.middleware.js";
import { checkInTicket } from "../../../services/ticket.service.js";

// PATCH /checkin/:ticketId/use
export const PATCH: RequestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR", "COLLABORATOR"]),
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id as string;
      const { ticketId } = req.params;
      const result = await checkInTicket(ticketId, userId);
      res.status(200).json(result);
    } catch (err: any) {
      if (err.status && err.message) {
        res.status(err.status).json({ error: err.message });
      } else {
        console.error("[PATCH /checkin/:ticketId/use] Unexpected error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
