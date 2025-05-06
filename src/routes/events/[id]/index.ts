import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "@/lib/middlewares/required-event-role.middleware.js";
import * as eventService from "@/services/event.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";

// PATCH /events/:id
export const PATCH: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  async (req: ExtendedRequest, res: Response) => {
    try {
      const userId = req.userId as string;
      const updated = await eventService.updateDraftEvent(
        req.params.id,
        userId,
        req.body,
      );
      res.status(200).json(updated);
    } catch (err: any) {
      if (err.status && err.message) {
        res.status(err.status).json({ error: err.message });
      } else {
        console.error("[PATCH /events/:id] Unexpected error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];

// DELETE /events/:id
export const DEL: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER"]),
  async (req: ExtendedRequest, res: Response) => {
    try {
      const userId = req.userId as string;
      await eventService.deleteEvent(req.params.id, userId);
      res.status(204).send();
    } catch (err: any) {
      if (err.status && err.message) {
        res.status(err.status).json({ error: err.message });
      } else {
        console.error("[DELETE /events/:id] Unexpected error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
