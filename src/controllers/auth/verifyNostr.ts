import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { verifyEvent, getEventHash, Event } from 'nostr-tools';
import { getPrisma } from '../../services/prisma.js';

const prisma = getPrisma();

export async function handleVerifyNostr(req: Request, res: Response) {
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
}
