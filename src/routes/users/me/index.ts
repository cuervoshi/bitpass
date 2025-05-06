import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "../../../lib/middlewares/require-auth.middleware.js";
import * as userService from "../../../services/user.service.js";

// GET /users/me
export const GET: RequestHandler[] = [
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;
    const profile = await userService.getProfile(userId);
    res.status(200).json(profile);
  },
];
