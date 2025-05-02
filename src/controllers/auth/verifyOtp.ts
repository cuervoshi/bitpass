import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getPrisma } from '../../services/prisma.js';

const prisma = getPrisma();

export async function handleVerifyOtp(req: Request, res: Response) {
  try {
    const { email, code } = req.body;

    if (typeof email !== 'string' || typeof code !== 'string') {
      res.status(400).json({ error: 'Invalid parameters' });
      return;
    }

    const loginCode = await prisma.loginCode.findFirst({
      where: {
        email,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!loginCode) {
      res.status(401).json({ error: 'Invalid or expired code' });
      return;
    }

    if (loginCode.attempts >= 5) {
      await prisma.loginCode.update({
        where: { id: loginCode.id },
        data: { used: true },
      });
      res.status(403).json({ error: 'Too many attempts. Code blocked' });
      return;
    }

    if (loginCode.code !== code) {
      await prisma.loginCode.update({
        where: { id: loginCode.id },
        data: { attempts: { increment: 1 } },
      });
      res.status(401).json({ error: 'Incorrect code' });
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
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(200).json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
}
