-- AlterEnum
ALTER TYPE "CompanySubscriptionStatus" ADD VALUE 'TRIALING';

-- AlterTable
ALTER TABLE "Company" ADD COLUMN "subscriptionPriceId" TEXT;
