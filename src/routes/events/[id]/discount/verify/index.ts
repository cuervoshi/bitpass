import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "../../../../../lib/middlewares/require-auth.middleware.js";
import { validate } from "../../../../../lib/middlewares/validate.middleware.js";
import { z } from "zod";
import * as dcService from "../../../../../services/discount.service.js";

// POST /events/:id/discount/verify
export const POST: RequestHandler[] = [
  requireAuth,
  validate(z.object({ code: z.string().min(1) })),
  async (req: Request, res: Response) => {
    try {
      await dcService.validateDiscountCode(req.params.id, req.body.code);
      res.status(200).json({ valid: true });
    } catch (err: any) {
      res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "Internal server error" });
    }
  },
];
