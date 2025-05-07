import type { Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "@/lib/middlewares/required-event-role.middleware.js";
import { getDraftEvent } from "@/services/event.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";
import { z } from "zod";
import { logger } from "@/lib/utils.js";

const error = logger.extend("events:fetchDraft:error");

/**
 * GET /events/:id/edit
 * Fetches a draft event (with ticketTypes, discountCodes, team, paymentMethods)
 * for owner, moderator or collaborator.
 */
export const GET: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR", "COLLABORATOR"]),
  async (req: ExtendedRequest, res: Response) => {
    const paramsResult = z
      .object({ id: z.string().uuid() })
      .safeParse(req.params);

    if (!paramsResult.success) {
      res.status(400).json({ error: "Invalid event ID" });
      return;
    }
    const eventId = paramsResult.data.id;

    try {
      const evt = await getDraftEvent(eventId, req.userId);
      res.status(200).json(evt);
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        error("Unexpected error on GET /events/:id/edit: %O", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
