import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "@/lib/middlewares/required-event-role.middleware.js";
import * as eventService from "@/services/event.service.js";

// PATCH /events/:id/publish
export const PATCH: RequestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER"]),
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId as string;
      const published = await eventService.publishEvent(req.params.id, userId);
      res.status(200).json(published);
    } catch (err: any) {
      if (err.status && err.message) {
        res.status(err.status).json({ error: err.message });
      } else {
        console.error("[PATCH /events/:id/publish] Unexpected error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
