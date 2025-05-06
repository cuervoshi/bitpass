import type { Request, Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "@/lib/middlewares/required-event-role.middleware.js";
import { validate } from "@/lib/middlewares/validate.middleware.js";
import {
  AddTeamSchema,
} from "@/lib/validators/team.schema.js";
import * as teamService from "@/services/team.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";

// GET /events/:id/team
export const GET: RestHandler[] = [
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
export const POST: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER"]),
  validate(AddTeamSchema),
  async (req: ExtendedRequest, res: Response) => {
    try {
      const currentUserId = req.userId as string;
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
