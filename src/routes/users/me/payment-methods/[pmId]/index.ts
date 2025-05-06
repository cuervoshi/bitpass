import type { Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import * as userService from "@/services/user.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";

// DELETE /users/me/payment-methods/:pmId
export const DEL: RestHandler[] = [
  requireAuth,
  async (req: ExtendedRequest, res: Response) => {
    const userId = req.userId as string;
    await userService.deletePaymentMethod(userId, req.params.pmId);
    res.status(204).send();
  },
];
