import type {
  CreateTicketInput,
  UpdateTicketInput,
} from "../lib/validators/ticket.schema.js";
import { getPrisma } from "./prisma.service.js";

const prisma = getPrisma();

/**
 * Create a new TicketType under the given event.
 * - Only DRAFT events
 * - Only owner or team members
 * - Enforces unique (eventId, name)
 */
export async function createTicketType(
  eventId: string,
  userId: string,
  data: CreateTicketInput,
) {
  const evt = await prisma.event.findUnique({
    where: { id: eventId },
    include: { team: { where: { userId } } },
  });
  if (!evt) {
    throw { status: 404, message: "Event not found" };
  }

  if (evt.status !== "DRAFT") {
    throw { status: 400, message: "Cannot add tickets to a non-draft event" };
  }

  if (evt.creatorId !== userId && evt.team.length === 0) {
    throw { status: 403, message: "Forbidden" };
  }

  try {
    return await prisma.ticketType.create({
      data: {
        eventId,
        name: data.name,
        price: data.price,
        currency: data.currency,
        quantity: data.quantity,
      },
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      throw {
        status: 400,
        message: "A ticket with that name already exists for this event",
      };
    }

    throw err;
  }
}

/**
 * Update a ticket type under a draft event.
 * @throws status 404|400|403
 */
export async function updateTicketType(
  eventId: string,
  ticketId: string,
  userId: string,
  data: UpdateTicketInput,
) {
  const evt = await prisma.event.findUnique({
    where: { id: eventId },
    include: { team: { where: { userId } } },
  });
  if (!evt) throw { status: 404, message: "Event not found" };

  if (evt.status !== "DRAFT")
    throw { status: 400, message: "Cannot edit tickets of a non-draft event" };

  if (evt.creatorId !== userId && evt.team.length === 0) {
    throw { status: 403, message: "Forbidden" };
  }

  const existing = await prisma.ticketType.findUnique({
    where: { id: ticketId },
  });

  if (!existing) throw { status: 404, message: "Ticket type not found" };

  if (existing.eventId !== eventId) {
    throw { status: 400, message: "Ticket does not belong to this event" };
  }

  try {
    return await prisma.ticketType.update({
      where: { id: ticketId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.currency !== undefined && { currency: data.currency }),
        ...(data.quantity !== undefined && { quantity: data.quantity }),
      },
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      throw {
        status: 400,
        message: "A ticket with that name already exists for this event",
      };
    }
    throw err;
  }
}

/**
 * Delete a ticket type under a draft event.
 * @throws status 404|400|403
 */
export async function deleteTicketType(
  eventId: string,
  ticketId: string,
  userId: string,
) {
  const evt = await prisma.event.findUnique({
    where: { id: eventId },
    include: { team: { where: { userId } } },
  });
  if (!evt) throw { status: 404, message: "Event not found" };

  if (evt.status !== "DRAFT")
    throw {
      status: 400,
      message: "Cannot delete tickets of a non-draft event",
    };

  if (evt.creatorId !== userId && evt.team.length === 0) {
    throw { status: 403, message: "Forbidden" };
  }

  const existing = await prisma.ticketType.findUnique({
    where: { id: ticketId },
  });
  if (!existing) throw { status: 404, message: "Ticket type not found" };
  if (existing.eventId !== eventId) {
    throw { status: 400, message: "Ticket does not belong to this event" };
  }

  const soldCount = await prisma.ticket.count({
    where: { ticketTypeId: ticketId },
  });
  if (soldCount > 0) {
    throw {
      status: 400,
      message: "Cannot delete a ticket type with sold tickets",
    };
  }

  await prisma.ticketType.delete({ where: { id: ticketId } });
}
