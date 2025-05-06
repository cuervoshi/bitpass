import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { validate } from "@/lib/middlewares/validate.middleware.js";
import { CreateEventSchema } from "@/lib/validators/event.schema.js";
import * as eventService from "@/services/event.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";

// POST /events
export const POST: RestHandler[] = [
  requireAuth,
  validate(CreateEventSchema),
  async (req: ExtendedRequest, res: Response) => {
    try {
      const userId = req.userId as string;
      const event = await eventService.createDraftEvent(req.body, userId);
      res.status(201).json(event);
    } catch (err) {
      console.error("[POST /events] Error creating draft event:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];
