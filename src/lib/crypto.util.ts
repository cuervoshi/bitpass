import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  scryptSync,
} from "crypto";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
if (!ENCRYPTION_KEY) throw new Error("Missing ENCRYPTION_KEY env var");

const KEY = scryptSync(ENCRYPTION_KEY, "static-salt", 32);

export function encryptHex(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return [bytesToHex(iv), bytesToHex(tag), bytesToHex(encrypted)].join(":");
}

export function decryptHex(payload: string): string {
  const [ivHex, tagHex, encryptedHex] = payload.split(":");
  const iv = hexToBytes(ivHex);
  const tag = hexToBytes(tagHex);
  const encrypted = hexToBytes(encryptedHex);

  const decipher = createDecipheriv("aes-256-gcm", KEY, Buffer.from(iv));

  decipher.setAuthTag(Buffer.from(tag));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted)),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
