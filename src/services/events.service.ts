import type { CreateEventInput } from "../lib/validators/event.schema.js";
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
