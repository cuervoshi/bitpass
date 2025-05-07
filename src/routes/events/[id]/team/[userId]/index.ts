import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "@/lib/middlewares/required-event-role.middleware.js";
import { validate } from "@/lib/middlewares/validate.middleware.js";
import {
  UpdateTeamSchema,
  type UpdateTeamInput,
} from "@/lib/validators/team.schema.js";
import * as teamService from "@/services/team.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";

// PATCH /events/:id/team/:userId
export const PATCH: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER"]),
  validate(UpdateTeamSchema),
  async (req: ExtendedRequest, res: Response) => {
    try {
      const currentUserId = req.userId as string;
      const updated = await teamService.updateTeamMember(
        req.params.id,
        req.params.userId,
        req.body,
        currentUserId,
      );
      res.status(200).json(updated);
    } catch (err: any) {
      res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "Internal server error" });
    }
  },
];

// DELETE /events/:id/team/:userId
export const DEL: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER"]),
  async (req: ExtendedRequest, res: Response) => {
    try {
      const currentUserId = req.userId as string;

      await teamService.deleteTeamMember(
        req.params.id,
        req.params.userId,
        currentUserId,
      );

      res.status(204).send();
    } catch (err: any) {
      res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "Internal server error" });
    }
  },
];
