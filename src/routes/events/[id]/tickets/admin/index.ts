import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "../../../../../lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "../../../../../lib/middlewares/required-event-role.middleware.js";
import * as ticketService from "../../../../../services/ticket.service.js";

// GET /events/:id/tickets/admin
export const GET: RequestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId as string;
      const tickets = await ticketService.getAdminTicketTypes(
        req.params.id,
        userId,
      );
      res.status(200).json(tickets);
    } catch (err: any) {
      console.error("[GET /events/:id/tickets/admin] Unexpected error:", err);
      res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "Internal server error" });
    }
  },
];
