import type { Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "@/lib/middlewares/required-event-role.middleware.js";
import { validate } from "@/lib/middlewares/validate.middleware.js";
import {
  CreateDiscountSchema,
  UpdateDiscountSchema,
} from "@/lib/validators/discount.schema.js";
import * as dcService from "@/services/discount.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";
import { z } from "zod";
import { logger } from "@/lib/utils.js";

const logError = logger.extend("discount-codes:handler:error");
const paramsSchema = z.object({
  id: z.string().uuid(),
});

/**
 * GET /events/:id/discount-codes
 */
export const GET: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  async (req: ExtendedRequest, res: Response) => {
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid event ID" });
      return;
    }
    const eventId = parsed.data.id;

    try {
      const codes = await dcService.listDiscountCodes(eventId, req.userId);
      res.status(200).json(codes);
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        logError("Unexpected error on GET /events/:id/discount-codes: %O", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];

/**
 * POST /events/:id/discount-codes
 */
export const POST: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER"]),
  validate(CreateDiscountSchema),
  async (req: ExtendedRequest, res: Response) => {
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid event ID" });
      return;
    }
    const eventId = parsed.data.id;

    try {
      const dc = await dcService.createDiscountCode(
        eventId,
        req.userId,
        req.body,
      );
      res.status(201).json(dc);
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        logError(
          "Unexpected error on POST /events/:id/discount-codes: %O",
          err,
        );
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
