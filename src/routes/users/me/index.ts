import type { Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import * as userService from "@/services/user.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";
import { logger } from "@/lib/utils.js";

const error = logger.extend("users:me:error");

/**
 * GET /users/me
 */
export const GET: RestHandler[] = [
  requireAuth,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const userId = req.userId as string;
      const profile = await userService.getProfile(userId);
      res.status(200).json(profile);
    } catch (err: any) {
      if (typeof err.status === "number" && typeof err.message === "string") {
        res.status(err.status).json({ error: err.message });
      } else {
        error("Unexpected error fetching profile: %O", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
