import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "../../../../lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "../../../../lib/middlewares/required-event-role.middleware.js";
import { validate } from "../../../../lib/middlewares/validate.middleware.js";
import { CreateDiscountSchema } from "../../../../lib/validators/discount.schema.js";
import * as dcService from "../../../../services/discount.service.js";

// GET /events/:id/discount
export const GET = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const userId = (req as any).userId as string;
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
export const POST: RequestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER"]),
  validate(CreateDiscountSchema),
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId as string;
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
