import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "../../../../lib/middlewares/require-auth.middleware.js";
import * as userService from "../../../../services/user.service.js";

// GET /users/me/payment-methods
export const GET: RequestHandler[] = [
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = (req as any).userId as string;
    const methods = await userService.getPaymentMethods(userId);
    res.status(200).json(methods);
  },
];
