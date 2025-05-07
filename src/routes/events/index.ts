import type { Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { validate } from "@/lib/middlewares/validate.middleware.js";
import { CreateEventSchema } from "@/lib/validators/event.schema.js";
import * as eventService from "@/services/event.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";
import { logger } from "@/lib/utils.js";

const log = logger.extend("events:create");
const error = logger.extend("events:create:error");

/**
 * POST /events
 * Creates a new draft event.
 */
export const POST: RestHandler[] = [
  requireAuth,
  validate(CreateEventSchema),
  async (req: ExtendedRequest, res: Response) => {
    try {
      const userId = req.userId as string;
      const event = await eventService.createDraftEvent(req.body, userId);
      res.status(201).json(event);
    } catch (err: any) {
      error("Error creating draft event: %O", err);
      const status = typeof err.status === "number" ? err.status : 500;
      const message =
        typeof err.message === "string" ? err.message : "Internal server error";
      res.status(status).json({ error: message });
    }
  },
];
