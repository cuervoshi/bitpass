import type { NextFunction, Request, Response } from "express";
import { createDraftEvent, updateDraftEvent } from "../services/events.service.js";

export async function createEvent(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id as string;
    const event = await createDraftEvent(req.body, userId);

    res.status(201).json(event);
    return;
  } catch (err) {
    console.error("[createEvent] Error creating draft event:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

export async function updateEvent(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).user.id as string;
    const { id } = req.params;
    const updated = await updateDraftEvent(id, userId, req.body);
    res.status(200).json(updated);
    return;
  } catch (err: any) {
    if (err?.status && err?.message) {
      res.status(err.status).json({ error: err.message });
      return;
    }

    console.error("[updateEvent] Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}