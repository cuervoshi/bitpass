import type { Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import * as userService from "@/services/user.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";
import { z } from "zod";
import { logger } from "@/lib/utils.js";

const error = logger.extend("users:me:payment-methods:delete:error");

// DELETE /users/me/payment-methods/:pmId
export const DEL: RestHandler[] = [
  requireAuth,
  async (req: ExtendedRequest, res: Response) => {
    const paramsSchema = z.object({ pmId: z.string().uuid() });
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid payment method ID" });
      return;
    }

    try {
      await userService.deletePaymentMethod(req.userId, parsed.data.pmId);
      res.status(204).send();
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        error("Unexpected error deleting payment method: %O", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
