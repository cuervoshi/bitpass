import type { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import {
  verifyEvent,
  getEventHash,
  type Event as NostrEvent,
} from "nostr-tools";
import { getPrisma } from "../../../services/prisma.service.js";

const prisma = getPrisma();

export const POST: RequestHandler = async (req: Request, res: Response) => {
  try {
    const event = req.body as NostrEvent;
    if (
      !event ||
      event.kind !== 27235 ||
      !event.pubkey ||
      !event.sig ||
      !event.created_at ||
      !Array.isArray(event.tags)
    ) {
      res.status(400).json({ error: "Invalid NIP-98 event" });
      return;
    }

    event.id = getEventHash(event);
    if (!verifyEvent(event)) {
      res.status(401).json({ error: "Invalid signature" });
      return;
    }

    const user = await prisma.user.upsert({
      where: { nostrPubKey: event.pubkey },
      update: {},
      create: { nostrPubKey: event.pubkey },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(200).json({ success: true, token, user });
  } catch (err) {
    console.error("[POST /auth/verify-nostr] Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
