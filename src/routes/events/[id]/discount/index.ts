import type { Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "@/lib/middlewares/required-event-role.middleware.js";
import { validate } from "@/lib/middlewares/validate.middleware.js";
import { CreateDiscountSchema } from "@/lib/validators/discount.schema.js";
import * as dcService from "@/services/discount.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";

// GET /events/:id/discount
export const GET: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  async (req: ExtendedRequest, res: Response) => {
    try {
      const userId = req.userId as string;
      const codes = await dcService.listDiscountCodes(req.params.id, userId);
      res.status(200).json(codes);
    } catch (err: any) {
      res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "Internal server error" });
    }
  },
];

// POST /events/:id/discount
export const POST: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER"]),
  validate(CreateDiscountSchema),
  async (req: ExtendedRequest, res: Response) => {
    try {
      const userId = req.userId as string;
      const dc = await dcService.createDiscountCode(
        req.params.id,
        userId,
        req.body,
      );
      res.status(201).json(dc);
    } catch (err: any) {
      res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "Internal server error" });
    }
  },
];
