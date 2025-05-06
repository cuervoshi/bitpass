import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "../../../../lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "../../../../lib/middlewares/required-event-role.middleware.js";
import { validate } from "../../../../lib/middlewares/validate.middleware.js";
import {
  AddTeamSchema,
  type AddTeamInput,
} from "../../../../lib/validators/team.schema.js";
import * as teamService from "../../../../services/team.service.js";

// GET /events/:id/team
export const GET: RequestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR", "COLLABORATOR"]),
  async (req: Request, res: Response) => {
    try {
      const members = await teamService.listTeam(req.params.id);
      res.status(200).json(members);
    } catch (err: any) {
      res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "Internal server error" });
    }
  },
];

// POST /events/:id/team
export const POST: RequestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER"]),
  validate(AddTeamSchema),
  async (req: Request, res: Response) => {
    try {
      const currentUserId = (req as any).user.id as string;
      const member = await teamService.addTeamMember(
        req.params.id,
        req.body,
        currentUserId,
      );
      res.status(201).json(member);
    } catch (err: any) {
      res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "Internal server error" });
    }
  },
];
