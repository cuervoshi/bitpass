import express, { Router } from "express";
import { requireAuth } from "../lib/middlewares/require-auth.middleware.js";
import { validate } from "../lib/middlewares/validate.middleware.js";
import {
  AddTeamSchema,
  UpdateTeamSchema,
} from "../lib/validators/team.schema.js";
import {
  handleListTeam,
  handleAddTeam,
  handleUpdateTeam,
  handleDeleteTeam,
} from "../controllers/team.controller.js";
import { requireEventRole } from "src/lib/middlewares/required-event-role.middleware.js";

const router: Router = express.Router();

router.get(
  "/",
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR", "COLLABORATOR"]),
  handleListTeam,
);

router.post(
  "/",
  requireAuth,
  requireEventRole(["OWNER"]),
  validate(AddTeamSchema),
  handleAddTeam,
);

router.patch(
  "/:userId",
  requireAuth,
  requireEventRole(["OWNER"]),
  validate(UpdateTeamSchema),
  handleUpdateTeam,
);

router.delete(
  "/:userId",
  requireAuth,
  requireEventRole(["OWNER"]),
  handleDeleteTeam,
);

export default router;
