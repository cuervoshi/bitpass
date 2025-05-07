import type { Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "@/lib/middlewares/required-event-role.middleware.js";
import * as eventService from "@/services/event.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";
import { z } from "zod";
import { logger } from "@/lib/utils.js";

const error = logger.extend("events:handler:error");

/**
 * PATCH /events/:id
 * Updates one or more fields of an existing draft event.
 */
export const PATCH: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  async (req: ExtendedRequest, res: Response) => {
    const params = z.object({ id: z.string().uuid() }).safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Invalid event ID" });
      return;
    }
    const eventId = params.data.id;

    try {
      const updated = await eventService.updateDraftEvent(
        eventId,
        req.userId,
        req.body,
      );
      res.status(200).json(updated);
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        error("Unexpected error on PATCH /events/:id: %O", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];

/**
 * DELETE /events/:id
 * Deletes a draft event.
 */
export const DEL: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER"]),
  async (req: ExtendedRequest, res: Response) => {
    const params = z.object({ id: z.string().uuid() }).safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Invalid event ID" });
      return;
    }
    const eventId = params.data.id;

    try {
      await eventService.deleteEvent(eventId, req.userId);
      res.status(204).send();
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        error("Unexpected error on DELETE /events/:id: %O", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
