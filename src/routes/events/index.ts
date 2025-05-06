import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "../../lib/middlewares/require-auth.middleware.js";
import { validate } from "../../lib/middlewares/validate.middleware.js";
import { CreateEventSchema } from "../../lib/validators/event.schema.js";
import * as eventService from "../../services/event.service.js";

// POST /events
export const POST: RequestHandler[] = [
  requireAuth,
  validate(CreateEventSchema),
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId as string;
      const event = await eventService.createDraftEvent(req.body, userId);
      res.status(201).json(event);
    } catch (err) {
      console.error("[POST /events] Error creating draft event:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
