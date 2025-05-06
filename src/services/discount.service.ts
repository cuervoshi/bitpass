import type {
  CreateDiscountInput,
  UpdateDiscountInput,
} from "@/lib/validators/discount.schema.js";
import { getPrisma } from "./prisma.service.js";

const prisma = getPrisma();

/**
 * List all discount codes for an event (owner or team only).
 */
export async function listDiscountCodes(eventId: string, userId: string) {
  const evt = await prisma.event.findUnique({
    where: { id: eventId },
    include: { team: { where: { userId } } },
  });
  if (!evt) throw { status: 404, message: "Event not found" };
  if (evt.creatorId !== userId && evt.team.length === 0) {
    throw { status: 403, message: "Forbidden" };
  }
  return prisma.discountCode.findMany({ where: { eventId } });
}

/**
 * Create a new discount code under a draft event.
 */
export async function createDiscountCode(
  eventId: string,
  userId: string,
  input: CreateDiscountInput,
) {
  const evt = await prisma.event.findUnique({ where: { id: eventId } });
  if (!evt) throw { status: 404, message: "Event not found" };
  if (evt.creatorId !== userId) throw { status: 403, message: "Forbidden" };
  if (evt.status !== "DRAFT") {
    throw { status: 400, message: "Can only add codes to draft events" };
  }
  return prisma.discountCode.create({
    data: {
      eventId,
      code: input.code,
      percentage: input.percentage,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
      maxUses: input.maxUses,
    },
  });
}

/**
 * Update an existing discount code.
 */
export async function updateDiscountCode(
  eventId: string,
  codeId: string,
  userId: string,
  input: UpdateDiscountInput,
) {
  const dc = await prisma.discountCode.findUnique({
    where: { id: codeId },
    include: { event: true },
  });
  if (!dc) throw { status: 404, message: "Discount code not found" };
  if (dc.eventId !== eventId) {
    throw { status: 400, message: "Code does not belong to this event" };
  }
  if (dc.event.creatorId !== userId) {
    throw { status: 403, message: "Forbidden" };
  }
  if (dc.event.status !== "DRAFT") {
    throw { status: 400, message: "Can only edit codes on draft events" };
  }
  return prisma.discountCode.update({
    where: { id: codeId },
    data: {
      ...input,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : dc.expiresAt,
    },
  });
}

/**
 * Delete a discount code.
 */
export async function deleteDiscountCode(
  eventId: string,
  codeId: string,
  userId: string,
) {
  const dc = await prisma.discountCode.findUnique({
    where: { id: codeId },
    include: { event: true },
  });
  if (!dc) throw { status: 404, message: "Discount code not found" };
  if (dc.eventId !== eventId) {
    throw { status: 400, message: "Code does not belong to this event" };
  }
  if (dc.event.creatorId !== userId) {
    throw { status: 403, message: "Forbidden" };
  }
  if (dc.event.status !== "DRAFT") {
    throw { status: 400, message: "Can only delete codes on draft events" };
  }
  await prisma.discountCode.delete({ where: { id: codeId } });
}

/**
 * Validate that a discount code is usable for a given event.
 * @throws { status:404|400|403 } if the code is not found or invalid.
 */
export async function validateDiscountCode(eventId: string, code: string) {
  // 1) Find the code and include its event + existing uses
  const dc = await prisma.discountCode.findFirst({
    where: { eventId, code },
    include: {
      event: true,
      orders: true,
    },
  });
  if (!dc) {
    throw { status: 404, message: "Discount code not found" };
  }

  if (dc.event.status !== "PUBLISHED") {
    throw { status: 403, message: "Event not published" };
  }

  if (dc.expiresAt && dc.expiresAt < new Date()) {
    throw { status: 400, message: "Discount code expired" };
  }

  if (dc.maxUses != null && dc.orders.length >= dc.maxUses) {
    throw { status: 400, message: "Discount code usage limit reached" };
  }

  return { valid: true, code: dc.code, percentage: dc.percentage };
}
