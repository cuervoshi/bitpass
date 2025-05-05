import axios from "axios";
import { getPrisma } from "./prisma.service.js";
import { generateSecretKey, getPublicKey } from "nostr-tools";
import { encryptHex } from "src/lib/crypto.util.js";
import { bytesToHex } from "@noble/hashes/utils";
import { Prisma } from "prisma/client/index.js";

const prisma = getPrisma();

/**
 * Payload seguro para el perfil de usuario
 */
export type UserProfile = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    nostrPubKey: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

/**
 * Payload seguro para métodos de pago (sin campos sensibles)
 */
export type SafePaymentMethod = Prisma.PaymentMethodGetPayload<{
  select: {
    id: true;
    type: true;
    lightningAddress: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

/**
 * Retrieves basic user profile information.
 */
export async function getProfile(userId: string): Promise<UserProfile> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nostrPubKey: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw { status: 404, message: "User not found" };
  }
  return user;
}

/**
 * Lists all payment methods belonging to the user.
 */
export async function getPaymentMethods(
  userId: string,
): Promise<SafePaymentMethod[]> {
  return prisma.paymentMethod.findMany({
    where: { userId },
    select: {
      id: true,
      type: true,
      lightningAddress: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Adds a Lightning payment method for the user.
 */
export async function addLightningMethod(
  userId: string,
  lightningAddress: string,
): Promise<SafePaymentMethod> {
  const [userPart, domain] = lightningAddress.split("@");
  if (!userPart || !domain) {
    throw { status: 400, message: "Invalid Lightning address format" };
  }

  const lnurlUrl = `https://${domain}/.well-known/lnurlp/${userPart}`;
  let lnurlData: any;
  try {
    const resp = await axios.get(lnurlUrl, { timeout: 5000 });
    lnurlData = resp.data;
  } catch {
    throw { status: 400, message: "Failed to fetch LNURL-pay endpoint" };
  }
  if (
    typeof lnurlData.callback !== "string" ||
    typeof lnurlData.maxSendable !== "number" ||
    typeof lnurlData.minSendable !== "number"
  ) {
    throw { status: 400, message: "Invalid LNURL-pay response" };
  }

  const secretBytes = generateSecretKey();
  const proxyPubkey = getPublicKey(secretBytes);
  const proxySecretHex = bytesToHex(secretBytes);
  const encryptedSecret = encryptHex(proxySecretHex);

  try {
    return await prisma.paymentMethod.create({
      data: {
        userId,
        type: "LIGHTNING",
        lightningAddress,
        lnurlCallback: lnurlData.callback,
        proxyPubkey,
        proxyPrivkeyEncrypted: encryptedSecret,
      },
      select: {
        id: true,
        type: true,
        lightningAddress: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      throw { status: 400, message: "Lightning method already configured" };
    }
    throw err;
  }
}

/**
 * Deletes a payment method belonging to the user.
 */
export async function deletePaymentMethod(
  userId: string,
  pmId: string,
): Promise<void> {
  const pm = await prisma.paymentMethod.findUnique({
    where: { id: pmId },
    select: { userId: true },
  });
  if (!pm) {
    throw { status: 404, message: "Payment method not found" };
  }
  if (pm.userId !== userId) {
    throw { status: 403, message: "Forbidden" };
  }
  await prisma.paymentMethod.delete({ where: { id: pmId } });
}

/**
 * Updates the LNURL-pay address for an existing Lightning method.
 */
export async function updateLightningMethod(
  userId: string,
  pmId: string,
  newAddress: string,
): Promise<SafePaymentMethod> {
  const pm = await prisma.paymentMethod.findUnique({
    where: { id: pmId },
    select: { userId: true, type: true },
  });
  if (!pm) {
    throw { status: 404, message: "Payment method not found" };
  }
  if (pm.userId !== userId) {
    throw { status: 403, message: "Forbidden" };
  }
  if (pm.type !== "LIGHTNING") {
    throw { status: 400, message: "Not a Lightning method" };
  }

  const [userPart, domain] = newAddress.split("@");
  if (!userPart || !domain) {
    throw { status: 400, message: "Invalid Lightning address format" };
  }

  const lnurlUrl = `https://${domain}/.well-known/lnurlp/${userPart}`;
  let lnurlData: any;
  try {
    const resp = await axios.get(lnurlUrl, { timeout: 5000 });
    lnurlData = resp.data;
  } catch {
    throw { status: 400, message: "Failed to fetch LNURL-pay endpoint" };
  }
  if (
    typeof lnurlData.callback !== "string" ||
    typeof lnurlData.maxSendable !== "number" ||
    typeof lnurlData.minSendable !== "number"
  ) {
    throw { status: 400, message: "Invalid LNURL-pay response" };
  }

  return prisma.paymentMethod.update({
    where: { id: pmId },
    data: {
      lightningAddress: newAddress,
      lnurlCallback: lnurlData.callback,
      updatedAt: new Date(),
    },
    select: {
      id: true,
      type: true,
      lightningAddress: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
