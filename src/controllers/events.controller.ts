import type { Request, Response } from "express";
import { createDraftEvent } from "../services/events.service.js";

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
