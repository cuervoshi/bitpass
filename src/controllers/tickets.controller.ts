import type { Request, Response } from "express";
import type { CreateTicketInput } from "../lib/validators/ticket.schema.js";
import * as ticketService from "src/services/tickets.service.js";

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
