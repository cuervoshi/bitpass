import type { NextFunction, Request, Response } from "express";
import * as eventService from "../services/event.service.js";

export async function createEvent(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id as string;
    const event = await eventService.createDraftEvent(req.body, userId);

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
  next: NextFunction,
) {
  try {
    const userId = (req as any).user.id as string;
    const { id } = req.params;
    const updated = await eventService.updateDraftEvent(id, userId, req.body);
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

export async function deleteEvent(req: Request<{ id: string }>, res: Response) {
  try {
    const userId = (req as any).user.id as string;
    const { id } = req.params;
    await eventService.deleteEvent(id, userId);

    res.status(204).send();
    return;
  } catch (err: any) {
    if (err?.status && err?.message) {
      res.status(err.status).json({ error: err.message });
      return;
    }

    console.error("[deleteEvent] Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

export async function getDraftEvent(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const userId = (req as any).user.id as string;
    const { id } = req.params;

    const evt = await eventService.getDraftEvent(id, userId);
    res.status(200).json(evt);

    return;
  } catch (err: any) {
    if (err?.status && err?.message) {
      res.status(err.status).json({ error: err.message });
      return;
    }

    console.error("[getDraftEvent] Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

/**
 * PATCH /events/:id/publish
 */
export async function handlePublishEvent(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    const userId = (req as any).user.id as string;
    const { id } = req.params;
    const published = await eventService.publishEvent(id, userId);
    res.status(200).json(published);
    return;
  } catch (err: any) {
    if (err?.status && err?.message) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    console.error("[handlePublishEvent] Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}
