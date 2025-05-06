import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "../../../../../../lib/middlewares/require-auth.middleware.js";
import { validate } from "../../../../../../lib/middlewares/validate.middleware.js";
import {
  CreateLightningSchema,
  type CreateLightningInput,
} from "../../../../../../lib/validators/payment.schema.js";
import * as userService from "../../../../../../services/user.service.js";

// PATCH /users/me/payment-methods/:pmId/lightning
export const PATCH: RequestHandler[] = [
  requireAuth,
  validate(CreateLightningSchema),
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;
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
