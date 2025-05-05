// src/controllers/user.controller.ts

import type { Request, Response } from "express";
import * as userService from "../services/user.service.js";
import type { CreateLightningInput } from "../lib/validators/payment.schema.js";

/**
 * GET /users/me
 */
export async function handleGetProfile(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = (req as any).user.id as string;
  const profile = await userService.getProfile(userId);
  res.status(200).json(profile);
  return;
}

/**
 * GET /users/me/payment-methods
 */
export async function handleGetPaymentMethods(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = (req as any).user.id as string;
  const methods = await userService.getPaymentMethods(userId);
  res.status(200).json(methods);
  return;
}

/**
 * POST /users/me/payment-methods/lightning
 */
export async function handleAddLightning(
  req: Request<{}, {}, CreateLightningInput>,
  res: Response,
): Promise<void> {
  const userId = (req as any).user.id as string;
  const { lightningAddress } = req.body;
  const pm = await userService.addLightningMethod(userId, lightningAddress);
  res.status(201).json(pm);
  return;
}

/**
 * DELETE /users/me/payment-methods/:pmId
 */
export async function handleDeletePaymentMethod(
  req: Request<{ pmId: string }>,
  res: Response,
): Promise<void> {
  const userId = (req as any).user.id as string;
  await userService.deletePaymentMethod(userId, req.params.pmId);
  res.status(204).send();
  return;
}

/**
 * PATCH /users/me/payment-methods/:pmId/lightning
 * Body: { lightningAddress: string }
 */
export async function handleUpdateLightning(
  req: Request<{ pmId: string }, {}, { lightningAddress: string }>,
  res: Response,
): Promise<void> {
  try {
    const userId = (req as any).user.id as string;
    const { pmId } = req.params;
    const { lightningAddress } = req.body;

    const updated = await userService.updateLightningMethod(
      userId,
      pmId,
      lightningAddress,
    );

    res.status(200).json(updated);
    return;
  } catch (err: any) {
    if (err.status && err.message) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    console.error("[handleUpdateLightning]", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}
