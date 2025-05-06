import {
  AddTeamInput,
  UpdateTeamInput,
} from "@/lib/validators/team.schema.js";
import { getPrisma } from "./prisma.service.js";

const prisma = getPrisma();

/**
 * List all team members of an event.
 */
export async function listTeam(eventId: string) {
  return prisma.eventMember.findMany({
    where: { eventId },
    select: { userId: true, role: true, createdAt: true },
  });
}

/**
 * Add a new member to the event team.
 */
export async function addTeamMember(
  eventId: string,
  { userId, role }: AddTeamInput,
  currentUserId: string,
) {
  // ensure event exists and currentUserId is OWNER
  const evt = await prisma.event.findUnique({ where: { id: eventId } });
  if (!evt) throw { status: 404, message: "Event not found" };
  if (evt.creatorId !== currentUserId)
    throw { status: 403, message: "Forbidden" };

  // prevent duplicate
  const exists = await prisma.eventMember.findUnique({
    where: { eventId_userId: { eventId, userId } },
  });
  if (exists) throw { status: 409, message: "Member already exists" };

  return prisma.eventMember.create({
    data: { eventId, userId, role },
  });
}

/**
 * Update role of an existing team member.
 */
export async function updateTeamMember(
  eventId: string,
  memberUserId: string,
  { role }: UpdateTeamInput,
  currentUserId: string,
) {
  const evt = await prisma.event.findUnique({
    where: { id: eventId },
    include: { team: true },
  });
  if (!evt) throw { status: 404, message: "Event not found" };
  if (evt.creatorId !== currentUserId)
    throw { status: 403, message: "Forbidden" };

  const member = evt.team.find((m) => m.userId === memberUserId);
  if (!member) throw { status: 404, message: "Member not found" };

  // prevent removing last owner
  if (member.role === "OWNER" && role !== "OWNER") {
    const numOwners = evt.team.filter((m) => m.role === "OWNER").length;
    if (numOwners < 2)
      throw { status: 400, message: "Cannot remove last owner" };
  }

  return prisma.eventMember.update({
    where: { eventId_userId: { eventId, userId: memberUserId } },
    data: { role },
  });
}

/**
 * Delete a team member.
 */
export async function deleteTeamMember(
  eventId: string,
  memberUserId: string,
  currentUserId: string,
) {
  const evt = await prisma.event.findUnique({
    where: { id: eventId },
    include: { team: true },
  });
  if (!evt) throw { status: 404, message: "Event not found" };
  if (evt.creatorId !== currentUserId)
    throw { status: 403, message: "Forbidden" };

  const member = evt.team.find((m) => m.userId === memberUserId);
  if (!member) throw { status: 404, message: "Member not found" };

  // prevent removing last owner
  if (member.role === "OWNER") {
    const numOwners = evt.team.filter((m) => m.role === "OWNER").length;
    if (numOwners < 2)
      throw { status: 400, message: "Cannot remove last owner" };
  }

  await prisma.eventMember.delete({
    where: { eventId_userId: { eventId, userId: memberUserId } },
  });
}
