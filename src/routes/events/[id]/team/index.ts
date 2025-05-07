import type { Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "@/lib/middlewares/required-event-role.middleware.js";
import { validate } from "@/lib/middlewares/validate.middleware.js";
import { AddTeamSchema } from "@/lib/validators/team.schema.js";
import * as teamService from "@/services/team.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";
import { z } from "zod";
import { logger } from "@/lib/utils.js";

const logError = logger.extend("team:handler:error");
const paramsSchema = z.object({ id: z.string().uuid() });

/**
 * GET /events/:id/team
 */
export const GET: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR", "COLLABORATOR"]),
  async (req: ExtendedRequest, res: Response) => {
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid event ID" });
      return;
    }
    const eventId = parsed.data.id;

    try {
      const members = await teamService.listTeam(eventId);
      res.status(200).json(members);
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        logError("Unexpected error on GET /events/:id/team: %O", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];

/**
 * POST /events/:id/team
 */
export const POST: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER"]),
  validate(AddTeamSchema),
  async (req: ExtendedRequest, res: Response) => {
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid event ID" });
      return;
    }
    const eventId = parsed.data.id;

    try {
      const member = await teamService.addTeamMember(
        eventId,
        req.body,
        req.userId,
      );
      res.status(201).json(member);
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        logError("Unexpected error on POST /events/:id/team: %O", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
