import type { Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { validate } from "@/lib/middlewares/validate.middleware.js";
import * as dcService from "@/services/discount.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";
import { z } from "zod";
import { logger } from "@/lib/utils.js";

const logError = logger.extend("discount-codes:verify:error");

const paramsSchema = z.object({
  id: z.string().uuid(),
});

/**
 * POST /events/:id/discount-codes/verify
 */
export const POST: RestHandler[] = [
  requireAuth,
  validate(z.object({ code: z.string().min(1) })),
  async (req: ExtendedRequest, res: Response) => {
    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Invalid event ID" });
      return;
    }
    const eventId = params.data.id;
    const { code } = req.body;

    try {
      await dcService.validateDiscountCode(eventId, code);
      res.status(200).json({ valid: true });
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        logError("Unexpected error verifying discount code: %O", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
