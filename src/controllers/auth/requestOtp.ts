import { Request, Response } from 'express';
import { getPrisma } from '../../services/prisma.js';

const prisma = getPrisma();

export async function handleRequestOtp(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'Invalid email' });
      return;
    }

    const existing = await prisma.loginCode.findFirst({
      where: {
        email,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    const code = existing
      ? existing.code
      : Math.floor(100000 + Math.random() * 900000).toString();

    if (!existing) {
      const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes
      await prisma.loginCode.create({
        data: { email, code, expiresAt },
      });
    }

    console.log(`[OTP] Code for ${email}: ${code}`);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
}
