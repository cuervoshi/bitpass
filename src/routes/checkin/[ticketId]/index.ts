import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "../../../lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "../../../lib/middlewares/required-event-role.middleware.js";
import { getTicketInfo } from "../../../services/ticket.service.js";

// GET /checkin/:ticketId
export const GET: RequestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR", "COLLABORATOR"]),
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId as string;
      const { ticketId } = req.params;
      const ticket = await getTicketInfo(ticketId, userId);
      res.status(200).json(ticket);
    } catch (err: any) {
      if (err.status && err.message) {
        res.status(err.status).json({ error: err.message });
      } else {
        console.error("[GET /checkin/:ticketId] Unexpected error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
