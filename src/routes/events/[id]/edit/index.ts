import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "../../../../lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "../../../../lib/middlewares/required-event-role.middleware.js";
import * as eventService from "../../../../services/event.service.js";

// GET /events/:id/edit
export const GET: RequestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR", "COLLABORATOR"]),
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId as string;
      const evt = await eventService.getDraftEvent(req.params.id, userId);
      res.status(200).json(evt);
    } catch (err: any) {
      if (err.status && err.message) {
        res.status(err.status).json({ error: err.message });
      } else {
        console.error("[GET /events/:id/edit] Unexpected error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
