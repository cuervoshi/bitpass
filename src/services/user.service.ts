import axios from "axios";
import { getPrisma } from "./prisma.service.js";
import { generateSecretKey, getPublicKey } from "nostr-tools";
import { encryptHex } from "src/lib/crypto.util.js";
import { bytesToHex } from "@noble/hashes/utils";

const prisma = getPrisma();

/**
 * Retrieves basic user profile information.
 * @param userId - UUID of the user
 * @returns Selected user fields
 * @throws { status:404, message } if the user is not found
 */
export async function getProfile(userId: string) {
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
 * @param userId - UUID of the user
 * @returns Array of payment methods
 */
export async function getPaymentMethods(userId: string) {
  return prisma.paymentMethod.findMany({
    where: { userId },
    select: {
      id: true,
      type: true,
      lightningAddress: true,
      lnurlCallback: true,
      proxyPubkey: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Adds a Lightning payment method for the user:
 * 1) Validates the LNURL-pay endpoint (.well-known)
 * 2) Generates a Nostr keypair for the proxy account
 * 3) Encrypts the proxy secret key with AES-GCM
 * 4) Persists the PaymentMethod with callback and encrypted proxy key
 */
export async function addLightningMethod(
  userId: string,
  lightningAddress: string,
) {
  // Split "user@domain.com" into user and domain
  const [user, domain] = lightningAddress.split("@");
  if (!user || !domain) {
    throw { status: 400, message: "Invalid Lightning address format" };
  }

  // Fetch and validate the LNURL-pay endpoint
  const lnurlUrl = `https://${domain}/.well-known/lnurlp/${user}`;
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

  // Generate a Nostr secret key (hex) and derive its public key for the proxy account
  const secretBytes = generateSecretKey();
  const proxyPubkey = getPublicKey(secretBytes);
  const proxySecretHex = bytesToHex(secretBytes);

  // Encrypt the secret key before storing
  const encryptedSecret = encryptHex(proxySecretHex);

  // Create the new payment method record, including the proxy keys
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
    });
  } catch (err: any) {
    // Handle unique constraint violation: one LIGHTNING method per user
    if (err.code === "P2002") {
      throw { status: 400, message: "Lightning method already configured" };
    }
    throw err;
  }
}

/**
 * Deletes a payment method belonging to the user.
 * @param userId - UUID of the user
 * @param pmId - UUID of the payment method
 * @throws { status:404|403 } on missing or forbidden access
 */
export async function deletePaymentMethod(
  userId: string,
  pmId: string,
): Promise<void> {
  const pm = await prisma.paymentMethod.findUnique({
    where: { id: pmId },
  });

  if (!pm) {
    throw { status: 404, message: "Payment method not found" };
  }

  if (pm.userId !== userId) {
    throw { status: 403, message: "Forbidden" };
  }

  await prisma.paymentMethod.delete({
    where: { id: pmId },
  });
}

/**
 * Updates the LNURL-pay address for an existing Lightning payment method.
 * 1) Validates the new LNURL-pay endpoint
 * 2) Updates lightningAddress + lnurlCallback in la BD
 */
export async function updateLightningMethod(
  userId: string,
  pmId: string,
  newAddress: string,
) {
  // 1) Fetch the existing PaymentMethod
  const pm = await prisma.paymentMethod.findUnique({
    where: { id: pmId },
    select: {
      id: true,
      userId: true,
      type: true,
      proxyPubkey: true,
      proxyPrivkeyEncrypted: true,
    },
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

  // 2) Parse newAddress
  const [user, domain] = newAddress.split("@");
  if (!user || !domain) {
    throw { status: 400, message: "Invalid Lightning address format" };
  }

  // 3) Fetch & validate LNURL-pay
  const lnurlUrl = `https://${domain}/.well-known/lnurlp/${user}`;
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

  // 4) Update the record
  return prisma.paymentMethod.update({
    where: { id: pmId },
    data: {
      lightningAddress: newAddress,
      lnurlCallback: lnurlData.callback,
      updatedAt: new Date(),
    },
  });
}
