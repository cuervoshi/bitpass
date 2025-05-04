import { Request, Response } from "express";
import { getPrisma } from "../services/prisma.service.js";

const prisma = getPrisma();

export async function handleGetProfile(req: Request, res: Response) {
  const userId = (req as any).userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nostrPubKey: true,
      createdAt: true,
    },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.status(200).json({ user });
}
