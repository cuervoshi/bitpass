import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { validate } from "@/lib/middlewares/validate.middleware.js";
import {
  CreateLightningSchema,
  type CreateLightningInput,
} from "@/lib/validators/payment.schema.js";
import * as userService from "@/services/user.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";

// PATCH /users/me/payment-methods/:pmId/lightning
export const PATCH: RestHandler[] = [
  requireAuth,
  validate(CreateLightningSchema),
  async (req: ExtendedRequest, res: Response) => {
    const userId = req.userId as string;
    const { pmId } = req.params;
    const { lightningAddress } = req.body;
    const updated = await userService.updateLightningMethod(
      userId,
      pmId,
      lightningAddress,
    );
    res.status(200).json(updated);
  },
];
