import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getPrisma } from "@/services/prisma.service.js";
import { RestHandler } from "@/types/rest.js";

const prisma = getPrisma();

/**
 * POST /auth/verify-otp
 * Verifies an OTP code, upserts the user and returns a JWT.
 */
export const POST: RestHandler = async (req: Request, res: Response) => {
  const rawEmail = req.body.email;
  const code = req.body.code;
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

  if (!email || typeof code !== "string") {
    res.status(400).json({ error: "Invalid parameters" });
    return;
  }

  try {
    const loginCode = await prisma.loginCode.findFirst({
      where: {
        email,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!loginCode) {
      res.status(401).json({ error: "Invalid or expired code" });
      return;
    }

    if (loginCode.attempts >= 5) {
      await prisma.loginCode.update({
        where: { id: loginCode.id },
        data: { used: true },
      });
      res.status(403).json({ error: "Too many attempts; code blocked" });
      return;
    }

    if (loginCode.code !== code) {
      await prisma.loginCode.update({
        where: { id: loginCode.id },
        data: { attempts: { increment: 1 } },
      });
      res.status(401).json({ error: "Invalid or expired code" });
      return;
    }

    await prisma.loginCode.update({
      where: { id: loginCode.id },
      data: { used: true },
    });

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
      select: {
        id: true,
        email: true,
        nostrPubKey: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, secret, {
      expiresIn: "7d",
    });

    res.status(200).json({ success: true, token, user });
    return;
  } catch (err) {
    console.error("[POST /auth/verify-otp] Error:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
