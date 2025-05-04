import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  verifyEvent,
  getEventHash,
  type Event as NostrEvent,
} from 'nostr-tools';
import { getPrisma } from '@/services/prisma.service.js';

const prisma = getPrisma();

/**
 * POST /auth/request-otp
 * Body: { email: string }
 */
export async function handleRequestOtp(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email } = req.body;
    if (typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'Invalid email' });
      return;
    }

    // Reuse unexpired, unused code if it exists
    const existing = await prisma.loginCode.findFirst({
      where: {
        email,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    const code =
      existing?.code ??
      Math.floor(100000 + Math.random() * 900000).toString();

    if (!existing) {
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await prisma.loginCode.create({
        data: { email, code, expiresAt },
      });
    }

    console.log(`[OTP] Code for ${email}: ${code}`);
    // TODO: send code via email
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('[handleRequestOtp] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /auth/verify-otp
 * Body: { email: string, code: string }
 */
export async function handleVerifyOtp(
  req: Request,
  res: Response
): Promise<void> {
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
      res.status(403).json({ error: 'Too many attempts; code blocked' });
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

    // Find or create the user
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    // Issue JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(200).json({ success: true, token, user });
  } catch (err) {
    console.error('[handleVerifyOtp] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /auth/verify-nostr
 * Body: NIP-98 event JSON
 */
export async function handleVerifyNostr(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const event = req.body as NostrEvent;

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

    // Compute and attach event ID
    event.id = getEventHash(event);

    // Verify signature
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

    // Issue JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(200).json({ success: true, token, user });
  } catch (err) {
    console.error('[handleVerifyNostr] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
