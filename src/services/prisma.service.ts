// lib/prisma.ts
import { PrismaClient } from "~/prisma/client/index.js";

let prisma: PrismaClient;

export function getPrisma(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: [{ level: "query", emit: "event" }],
    });
  }
  return prisma;
}
