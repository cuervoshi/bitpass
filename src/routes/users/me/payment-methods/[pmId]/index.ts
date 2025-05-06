import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "../../../../../lib/middlewares/require-auth.middleware.js";
import * as userService from "../../../../../services/user.service.js";

// DELETE /users/me/payment-methods/:pmId
export const DEL: RequestHandler[] = [
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;
    await userService.deletePaymentMethod(userId, req.params.pmId);
    res.status(204).send();
  },
];
