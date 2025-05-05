import express, { Router } from "express";
import { requireAuth } from "../lib/middlewares/require-auth.middleware.js";
import {
  handleFetchTicket,
  handleCheckInTicket,
} from "src/controllers/checkin.controller.js";

const router: Router = express.Router();

router.get("/:ticketId", requireAuth, handleFetchTicket);
router.patch("/:ticketId/checkin", requireAuth, handleCheckInTicket);

export default router;
