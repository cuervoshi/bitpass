import { TicketType } from "prisma/client/index.js";
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

/**
 * Public listing: ticket types of a PUBLISHED event
 * with sold and available counts.
 */
export async function getPublicTicketTypes(eventId: string) {
  const evt = await prisma.event.findUnique({
    where: { id: eventId, status: "PUBLISHED" },
    select: { id: true },
  });
  if (!evt) {
    throw { status: 404, message: "Event not found or not published" };
  }

  const types = await prisma.ticketType.findMany({
    where: { eventId },
    include: {
      _count: { select: { tickets: true } },
    },
  });

  return types.map((t) => ({
    id: t.id,
    name: t.name,
    price: t.price,
    currency: t.currency,
    sold: t._count.tickets,
    available: t.quantity - t._count.tickets,
  }));
}

/**
 * Admin listing: ticket types with all their orders and tickets
 * for DRAFT or PUBLISHED events, but only the owner or team members can view.
 */
export async function getAdminTicketTypes(
  eventId: string,
  userId: string,
): Promise<
  (TicketType & {
    orders: { id: string; buyerId: string; quantity: number; price: number }[];
    tickets: { id: string; ownerId: string; isCheckedIn: boolean }[];
  })[]
> {
  const evt = await prisma.event.findUnique({
    where: { id: eventId },
    include: { team: { where: { userId } } },
  });
  if (!evt) throw { status: 404, message: "Event not found" };
  if (evt.creatorId !== userId && evt.team.length === 0) {
    throw { status: 403, message: "Forbidden" };
  }

  const types = await prisma.ticketType.findMany({
    where: { eventId },
    include: {
      orderItems: {
        include: { order: true },
      },
      tickets: true,
    },
  });

  return types.map((t) => ({
    ...t,
    orders: t.orderItems.map((oi) => ({
      id: oi.order.id,
      buyerId: oi.order.buyerId,
      quantity: oi.quantity,
      price: oi.price,
    })),
    tickets: t.tickets.map((tc) => ({
      id: tc.id,
      ownerId: tc.ownerId,
      isCheckedIn: tc.isCheckedIn,
    })),
  }));
}

/**
 * Fetch ticket info, verifying user has rights on its event.
 */
export async function getTicketInfo(ticketId: string, userId: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      event: { select: { creatorId: true, team: { where: { userId } } } },
      ticketType: { select: { name: true, price: true, currency: true } },
    },
  });
  if (!ticket) throw { status: 404, message: "Ticket not found" };

  // permission: owner or team member
  if (ticket.event.creatorId !== userId && ticket.event.team.length === 0) {
    throw { status: 403, message: "Forbidden" };
  }

  return {
    id: ticket.id,
    eventId: ticket.eventId,
    ticketType: ticket.ticketType,
    ownerId: ticket.ownerId,
    isCheckedIn: ticket.isCheckedIn,
  };
}

/**
 * Mark a ticket as checked-in, verifying the same permissions.
 */
export async function checkInTicket(ticketId: string, userId: string) {
  const info = await getTicketInfo(ticketId, userId);
  if (info.isCheckedIn) {
    throw { status: 400, message: "Ticket already checked in" };
  }

  const updated = await prisma.ticket.update({
    where: { id: ticketId },
    data: { isCheckedIn: true },
  });

  return {
    id: updated.id,
    isCheckedIn: updated.isCheckedIn,
  };
}
