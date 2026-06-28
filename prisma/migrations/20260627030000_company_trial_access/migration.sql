-- CreateEnum
CREATE TYPE "CompanyAccessStatus" AS ENUM ('TRIAL', 'ACTIVE', 'EXPIRED');

-- AlterTable
ALTER TABLE "Company"
ADD COLUMN "trialStartedAt" TIMESTAMP(3),
ADD COLUMN "trialEndsAt" TIMESTAMP(3),
ADD COLUMN "accessStatus" "CompanyAccessStatus" NOT NULL DEFAULT 'TRIAL',
ADD COLUMN "trialExtendedAt" TIMESTAMP(3),
ADD COLUMN "trialExtendedByAdminId" TEXT,
ADD COLUMN "trialExtensionReason" TEXT;
