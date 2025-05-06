import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import * as userService from "@/services/user.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";

// GET /users/me/payment-methods
export const GET: RestHandler[] = [
  requireAuth,
  async (req: ExtendedRequest, res: Response) => {
    const userId = req.userId as string;
    const methods = await userService.getPaymentMethods(userId);
    res.status(200).json(methods);
  },
];
