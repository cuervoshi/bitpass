import express, { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getPrisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { verifyEvent, getEventHash, Event } from 'nostr-tools';

const prisma = getPrisma();
const router: Router = express.Router();

router.post('/otp-request', async (req: Request, res: Response) => {
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
});

router.post('/otp-verify', async (req: Request, res: Response) => {
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
});

router.post('/verify-nostr', async (req: Request, res: Response) => {
  try {
    const event = req.body as Event;

    if (
      !event ||
      typeof event !== 'object' ||
      event.kind !== 27235 ||
      !event.pubkey ||
      !event.sig ||
      !event.created_at ||
      !Array.isArray(event.tags)
    ) {
      res.status(400).json({ error: 'Invalid NIP-98 event' });
      return;
    }

    event.id = getEventHash(event);
    const valid = verifyEvent(event);

    if (!valid) {
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    const pubkey = event.pubkey;

    const user = await prisma.user.upsert({
      where: { nostrPubKey: pubkey },
      update: {},
      create: { nostrPubKey: pubkey },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.status(200).json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

router.get('/profile', requireAuth, async (req: Request, res: Response) => {
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
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.status(200).json({ user });
});

export default router;
