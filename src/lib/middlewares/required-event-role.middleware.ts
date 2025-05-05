import type { Request, Response, NextFunction } from "express";
import { EventRole } from "prisma/client/index.js";
import { getPrisma } from "src/services/prisma.service.js";

/**
 * Middleware factory: ensures the authenticated user has one of the given roles
 * on the event specified by req.params.id.
 *
 * @param allowedRoles Array of EventRole values that are permitted.
 */
export function requireEventRole(allowedRoles: EventRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id as string | undefined;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const eventId = req.params.id;
    const prisma = getPrisma();

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { team: true },
    });
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    if (allowedRoles.includes(EventRole.OWNER) && event.creatorId === userId) {
      next();
      return;
    }

    const membership = event.team.find((m) => m.userId === userId);
    if (!membership) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    if (!allowedRoles.includes(membership.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    next();
    return;
  };
}
