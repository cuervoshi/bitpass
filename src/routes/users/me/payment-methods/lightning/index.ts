import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { validate } from "@/lib/middlewares/validate.middleware.js";
import {
  CreateLightningSchema,
  type CreateLightningInput,
} from "@/lib/validators/payment.schema.js";
import * as userService from "@/services/user.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";

// POST /users/me/payment-methods/lightning
export const POST: RestHandler[] = [
  requireAuth,
  validate(CreateLightningSchema),
  async (req: ExtendedRequest, res: Response) => {
    const userId = req.userId as string;
    const { lightningAddress } = req.body;
    const pm = await userService.addLightningMethod(userId, lightningAddress);
    res.status(201).json(pm);
  },
];
