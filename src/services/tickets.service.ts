import type { CreateTicketInput } from "../lib/validators/ticket.schema.js";
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
