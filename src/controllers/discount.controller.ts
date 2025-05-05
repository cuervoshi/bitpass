import type { Request, Response } from "express";
import * as dcService from "../services/discount.service.js";
import type {
  CreateDiscountInput,
  UpdateDiscountInput,
} from "../lib/validators/discount.schema.js";

export async function handleListDiscounts(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    const userId = (req as any).user.id as string;
    const codes = await dcService.listDiscountCodes(req.params.id, userId);
    res.status(200).json(codes);
    return;
  } catch (err: any) {
    res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "Internal server error" });
    return;
  }
}

export async function handleCreateDiscount(
  req: Request<{ id: string }, {}, CreateDiscountInput>,
  res: Response,
): Promise<void> {
  try {
    const userId = (req as any).user.id as string;
    const dc = await dcService.createDiscountCode(
      req.params.id,
      userId,
      req.body,
    );
    res.status(201).json(dc);
    return;
  } catch (err: any) {
    res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "Internal server error" });
    return;
  }
}

export async function handleUpdateDiscount(
  req: Request<{ id: string; codeId: string }, {}, UpdateDiscountInput>,
  res: Response,
): Promise<void> {
  try {
    const userId = (req as any).user.id as string;
    const updated = await dcService.updateDiscountCode(
      req.params.id,
      req.params.codeId,
      userId,
      req.body,
    );
    res.status(200).json(updated);
    return;
  } catch (err: any) {
    res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "Internal server error" });
    return;
  }
}

export async function handleDeleteDiscount(
  req: Request<{ id: string; codeId: string }>,
  res: Response,
): Promise<void> {
  try {
    const userId = (req as any).user.id as string;
    await dcService.deleteDiscountCode(
      req.params.id,
      req.params.codeId,
      userId,
    );
    res.status(204).send();
    return;
  } catch (err: any) {
    res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "Internal server error" });
    return;
  }
}
