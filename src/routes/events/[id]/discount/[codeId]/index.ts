import type { Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "@/lib/middlewares/required-event-role.middleware.js";
import * as dcService from "@/services/discount.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";
import { z } from "zod";
import { validate } from "@/lib/middlewares/validate.middleware.js";
import { logger } from "@/lib/utils.js";
import { UpdateDiscountSchema } from "@/lib/validators/discount.schema.js";

const logError = logger.extend("discount-codes:handler:error");
const paramsSchema = z.object({
  id: z.string().uuid(),
  codeId: z.string().uuid(),
});

/**
 * PATCH /events/:id/discount-codes/:codeId
 */
export const PATCH: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER"]),
  validate(UpdateDiscountSchema),
  async (req: ExtendedRequest, res: Response) => {
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid event ID or discount code ID" });
      return;
    }
    const { id: eventId, codeId } = parsed.data;

    try {
      const updated = await dcService.updateDiscountCode(
        eventId,
        codeId,
        req.userId,
        req.body,
      );
      res.status(200).json(updated);
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        logError(
          "Unexpected error on PATCH /events/:id/discount-codes/:codeId: %O",
          err,
        );
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];

/**
 * DELETE /events/:id/discount-codes/:codeId
 */
export const DEL: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER"]),
  async (req: ExtendedRequest, res: Response) => {
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid event ID or discount code ID" });
      return;
    }
    const { id: eventId, codeId } = parsed.data;

    try {
      await dcService.deleteDiscountCode(eventId, codeId, req.userId);
      res.status(204).send();
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        logError(
          "Unexpected error on DELETE /events/:id/discount-codes/:codeId: %O",
          err,
        );
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
