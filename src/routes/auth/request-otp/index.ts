import type { Request, RequestHandler, Response } from "express";
import { getPrisma } from "@/services/prisma.service.js";

const prisma = getPrisma();

export const POST: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ error: "Invalid email" });
      return;
    }

    const existing = await prisma.loginCode.findFirst({
      where: {
        email,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    const code =
      existing?.code ?? Math.floor(100000 + Math.random() * 900000).toString();

    if (!existing) {
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await prisma.loginCode.create({ data: { email, code, expiresAt } });
    }

    console.log(`[OTP] Code for ${email}: ${code}`);
    // TODO: enviar email con el código
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("[POST /auth/request-otp] Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
