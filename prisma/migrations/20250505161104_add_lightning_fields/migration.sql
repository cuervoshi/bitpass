-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "lnurlCallback" TEXT,
ADD COLUMN     "proxyPrivkeyEncrypted" TEXT,
ADD COLUMN     "proxyPubkey" TEXT;
