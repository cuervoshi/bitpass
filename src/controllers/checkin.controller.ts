import type { Request, Response } from "express";
import { getTicketInfo, checkInTicket } from "../services/ticket.service.js";

/**
 * GET /tickets/:ticketId
 * Fetch ticket information (requires auth and permission).
 */
export async function handleFetchTicket(
  req: Request<{ ticketId: string }>,
  res: Response,
): Promise<void> {
  try {
    const userId = (req as any).user.id as string;
    const { ticketId } = req.params;
    const ticket = await getTicketInfo(ticketId, userId);
    res.status(200).json(ticket);
    return;
  } catch (err: any) {
    if (err.status && err.message) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    console.error("[handleFetchTicket] Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

/**
 * PATCH /tickets/:ticketId/checkin
 * Mark a ticket as checked in (requires auth and permission).
 */
export async function handleCheckInTicket(
  req: Request<{ ticketId: string }>,
  res: Response,
): Promise<void> {
  try {
    const userId = (req as any).user.id as string;
    const { ticketId } = req.params;
    const result = await checkInTicket(ticketId, userId);
    res.status(200).json(result);
    return;
  } catch (err: any) {
    if (err.status && err.message) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    console.error("[handleCheckInTicket] Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}
