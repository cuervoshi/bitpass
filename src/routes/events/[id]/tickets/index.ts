import type { Request, RequestHandler, Response } from "express";
import { requireAuth } from "@/lib/middlewares/require-auth.middleware.js";
import { requireEventRole } from "@/lib/middlewares/required-event-role.middleware.js";
import { validate } from "@/lib/middlewares/validate.middleware.js";
import { CreateTicketSchema } from "@/lib/validators/ticket.schema.js";
import * as ticketService from "@/services/ticket.service.js";
import { ExtendedRequest, RestHandler } from "@/types/rest.js";

// GET /events/:id/tickets
export const GET: RequestHandler = async (req: Request, res: Response) => {
  try {
    const tickets = await ticketService.getPublicTicketTypes(req.params.id);
    res.status(200).json(tickets);
  } catch (err: any) {
    console.error("[GET /events/:id/tickets] Unexpected error:", err);
    res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "Internal server error" });
  }
};

// POST /events/:id/tickets
export const POST: RestHandler[] = [
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  validate(CreateTicketSchema),
  async (req: ExtendedRequest, res: Response) => {
    try {
      const userId = req.userId as string;
      const eventId = req.params.id;
      const ticket = await ticketService.createTicketType(
        eventId,
        userId,
        req.body,
      );
      res.status(201).json(ticket);
    } catch (err: any) {
      if (err.status && err.message) {
        res.status(err.status).json({ error: err.message });
      } else {
        console.error("[POST /events/:id/tickets] Unexpected error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];
