import type { Request, Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "@/lib/middlewares/required-event-role.middleware.js";
import * as dcService from "@/services/discount.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";

// PATCH /events/:id/discount/:codeId
export const PATCH: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER"]),
  async (req: ExtendedRequest, res: Response) => {
    try {
      const userId = req.userId as string;
      const updated = await dcService.updateDiscountCode(
        req.params.id,
        req.params.codeId,
        userId,
        req.body,
      );
      res.status(200).json(updated);
    } catch (err: any) {
      res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "Internal server error" });
    }
  },
];

// DELETE /events/:id/discount/:codeId
export const del = [
  requireAuth,
  requireEventRole(["OWNER"]),
  async (req: Request<{ id: string; codeId: string }>, res: Response) => {
    try {
      const userId = (req as any).userId as string;
      await dcService.deleteDiscountCode(
        req.params.id,
        req.params.codeId,
        userId,
      );
      res.status(204).send();
    } catch (err: any) {
      res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "Internal server error" });
    }
  },
];
