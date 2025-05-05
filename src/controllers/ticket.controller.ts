import type { Request, Response } from "express";
import type {
  CreateTicketInput,
  UpdateTicketInput,
} from "../lib/validators/ticket.schema.js";
import * as ticketService from "src/services/ticket.service.js";

export async function createTicket(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const userId = (req as any).user.id as string;
    const eventId = req.params.id;
    const input = req.body as CreateTicketInput;

    const ticket = await ticketService.createTicketType(eventId, userId, input);
    res.status(201).json(ticket);
    return;
  } catch (err: any) {
    if (err?.status && err?.message) {
      res.status(err.status).json({ error: err.message });
      return;
    }

    console.error("[createTicket] Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

/**
 * PATCH /events/:id/tickets/:ticketId
 */
export async function updateTicket(
  req: Request<{ id: string; ticketId: string }>,
  res: Response,
) {
  try {
    const userId = (req as any).user.id as string;
    const { id: eventId, ticketId } = req.params;
    const input = req.body as UpdateTicketInput;

    const updated = await ticketService.updateTicketType(
      eventId,
      ticketId,
      userId,
      input,
    );
    res.status(200).json(updated);
    return;
  } catch (err: any) {
    if (err?.status && err?.message) {
      res.status(err.status).json({ error: err.message });
      return;
    }

    console.error("[updateTicket] Unexpected:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

/**
 * DELETE /events/:id/tickets/:ticketId
 */
export async function deleteTicket(
  req: Request<{ id: string; ticketId: string }>,
  res: Response,
) {
  try {
    const userId = (req as any).user.id as string;
    const { id: eventId, ticketId } = req.params;

    await ticketService.deleteTicketType(eventId, ticketId, userId);
    res.status(204).send();
    return;
  } catch (err: any) {
    if (err?.status && err?.message) {
      res.status(err.status).json({ error: err.message });
      return;
    }

    console.error("[deleteTicket] Unexpected:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}
