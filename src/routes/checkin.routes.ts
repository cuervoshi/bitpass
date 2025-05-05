import express, { Router } from "express";
import { requireAuth } from "../lib/middlewares/require-auth.middleware.js";
import {
  handleFetchTicket,
  handleCheckInTicket,
} from "src/controllers/checkin.controller.js";
import { requireEventRole } from "src/lib/middlewares/required-event-role.middleware.js";

const router: Router = express.Router();

router.get(
  "/:ticketId",
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR", "COLLABORATOR"]),
  handleFetchTicket,
);

router.patch(
  "/:ticketId/checkin",
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR", "COLLABORATOR"]),
  handleCheckInTicket,
);

export default router;
