import type { Request, Response } from "express";
import { getPrisma } from "@/services/prisma.service.js";
import { z } from "zod";
import crypto from "crypto";
import { RestHandler } from "@/types/rest.js";

const prisma = getPrisma();

const RequestOtpSchema = z.object({
  email: z.string().trim().email(),
});

export const POST: RestHandler = async (req: Request, res: Response) => {
  const parse = RequestOtpSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }
  const email = parse.data.email.toLowerCase();

  try {
    const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.$transaction(async (tx) => {
      const existing = await tx.loginCode.findFirst({
        where: {
          email,
          used: false,
          expiresAt: { gt: new Date() },
        },
      });

      if (existing) {
        await tx.loginCode.update({
          where: { id: existing.id },
          data: { code, expiresAt, attempts: 0 },
        });
      } else {
        await tx.loginCode.create({
          data: { email, code, expiresAt },
        });
      }
    });

    // TODO: real email sending logic here
    // await mailer.sendOtp(email, code);

    res.status(200).json({ success: true });
    return;
  } catch (err) {
    console.error("[POST /auth/request-otp] Error:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
