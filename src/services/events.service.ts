import {
  DiscountCode,
  EventMember,
  PaymentMethod,
  TicketType,
  type Event as EventModel,
} from "prisma/client/index.js";
import type {
  CreateEventInput,
  UpdateEventInput,
} from "../lib/validators/event.schema.js";
import { getPrisma } from "./prisma.service.js";

const prisma = getPrisma();

export async function createDraftEvent(data: CreateEventInput, userId: string) {
  const startsAt = new Date(`${data.startDate}T${data.startTime}:00`);
  const endsAt = new Date(`${data.endDate}T${data.endTime}:00`);

  return prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      startsAt,
      endsAt,
      status: "DRAFT",
      creatorId: userId,
    },
  });
}

/**
 * Update a draft event owned by userId.
 * Throws if not found, not owner, or not DRAFT.
 */
export async function updateDraftEvent(
  eventId: string,
  userId: string,
  input: UpdateEventInput,
) {
  const evt = await prisma.event.findUnique({ where: { id: eventId } });
  if (!evt) {
    throw { status: 404, message: "Event not found" };
  }
  if (evt.creatorId !== userId) {
    throw { status: 403, message: "Forbidden" };
  }

  const data: Record<string, any> = {};

  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.location !== undefined) data.location = input.location;

  if (input.startDate && input.startTime) {
    data.startsAt = new Date(`${input.startDate}T${input.startTime}:00`);
  }

  if (input.endDate && input.endTime) {
    data.endsAt = new Date(`${input.endDate}T${input.endTime}:00`);
  }

  return prisma.event.update({
    where: { id: eventId },
    data,
  });
}

/**
 * Deletes a draft event owned by userId.
 * - 404 if not found
 * - 403 if not owner
 * - 400 if not in DRAFT status
 */
export async function deleteEvent(
  eventId: string,
  userId: string,
): Promise<void> {
  const evt = await prisma.event.findUnique({ where: { id: eventId } });
  if (!evt) {
    throw { status: 404, message: "Event not found" };
  }
  if (evt.creatorId !== userId) {
    throw { status: 403, message: "Forbidden" };
  }
  if (evt.status !== "DRAFT") {
    throw { status: 400, message: "Only draft events can be deleted" };
  }
  await prisma.event.delete({ where: { id: eventId } });
}

/**
 * Fetches a draft event (and its sub-resources) owned by or shared with userId.
 * @throws { status:400|403|404, message:string }
 */
export async function getDraftEvent(
  eventId: string,
  userId: string,
): Promise<
  EventModel & {
    ticketTypes: TicketType[];
    discountCodes: DiscountCode[];
    team: EventMember[];
    paymentMethods: PaymentMethod[];
  }
> {
  const evt = await prisma.event.findFirst({
    where: {
      id: eventId,
      status: "DRAFT",
      OR: [{ creatorId: userId }, { team: { some: { userId } } }],
    },
    include: {
      ticketTypes: true,
      discountCodes: true,
      team: {
        include: { user: true },
      },
      paymentMethods: true,
    },
  });

  if (!evt) {
    const exists = await prisma.event.findUnique({ where: { id: eventId } });
    if (!exists) {
      throw { status: 404, message: "Event not found" };
    }

    if (exists.status !== "DRAFT") {
      throw { status: 400, message: "Only draft events can be fetched here" };
    }

    throw { status: 403, message: "Forbidden" };
  }

  return evt;
}
