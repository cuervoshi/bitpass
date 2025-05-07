import type { Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { validate } from "@/lib/middlewares/validate.middleware.js";
import { CreateLightningSchema } from "@/lib/validators/payment.schema.js";
import * as userService from "@/services/user.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";

// routes/users/me/payment-methods/lightning.ts
export const POST: RestHandler[] = [
  requireAuth,
  validate(CreateLightningSchema),
  async (req: ExtendedRequest, res: Response) => {
    try {
      const userId = req.userId;
      const { lightningAddress } = req.body;
      const pm = await userService.addLightningMethod(userId, lightningAddress);
      res.status(201).json(pm);
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        console.error(
          "[POST /users/me/payment-methods/lightning] Unexpected error:",
          err,
        );
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
