import type { Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "@/lib/middlewares/required-event-role.middleware.js";
import { validate } from "@/lib/middlewares/validate.middleware.js";
import {
  UpdateTeamSchema,
  type UpdateTeamInput,
} from "@/lib/validators/team.schema.js";
import * as teamService from "@/services/team.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";
import { z } from "zod";
import { logger } from "@/lib/utils.js";

const logError = logger.extend("team:handler:error");
const paramsSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
});

/**
 * PATCH /events/:id/team/:userId
 */
export const PATCH: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER"]),
  validate(UpdateTeamSchema),
  async (req: ExtendedRequest, res: Response) => {
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid event ID or user ID" });
      return;
    }
    const { id: eventId, userId: memberUserId } = parsed.data;
    const input = req.body as UpdateTeamInput;

    try {
      const updated = await teamService.updateTeamMember(
        eventId,
        memberUserId,
        input,
        req.userId,
      );
      res.status(200).json(updated);
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        logError("Unexpected error on PATCH /events/:id/team/:userId: %O", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];

/**
 * DELETE /events/:id/team/:userId
 */
export const DEL: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER"]),
  async (req: ExtendedRequest, res: Response) => {
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid event ID or user ID" });
      return;
    }
    const { id: eventId, userId: memberUserId } = parsed.data;

    try {
      await teamService.deleteTeamMember(eventId, memberUserId, req.userId);
      res.status(204).send();
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        logError(
          "Unexpected error on DELETE /events/:id/team/:userId: %O",
          err,
        );
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
