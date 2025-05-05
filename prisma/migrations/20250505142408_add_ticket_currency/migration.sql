-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'SAT', 'ARS');

-- AlterTable
ALTER TABLE "TicketType" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD';
