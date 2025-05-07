import { z } from "zod";
import { logger } from "@/lib/utils.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";
import { validate } from "@/lib/middlewares/validate.middleware.js";
import { CreateLightningSchema } from "@/lib/validators/payment.schema.js";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { Response } from "express";
import * as userService from "@/services/user.service.js";

const error = logger.extend("users:me:payment-methods:lightning:update:error");

// routes/users/me/payment-methods/lightning.ts
export const PATCH: RestHandler[] = [
  requireAuth,
  validate(CreateLightningSchema),
  async (req: ExtendedRequest, res: Response) => {
    const paramsSchema = z.object({ pmId: z.string().uuid() });
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid payment method ID" });
      return;
    }

    try {
      const updated = await userService.updateLightningMethod(
        req.userId,
        parsed.data.pmId,
        req.body.lightningAddress,
      );
      res.status(200).json(updated);
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        error("Unexpected error updating Lightning method: %O", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
