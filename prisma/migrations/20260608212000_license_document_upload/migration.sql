-- CreateEnum
CREATE TYPE "LicenseVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- AlterTable
ALTER TABLE "License"
ADD COLUMN "verificationStatus" "LicenseVerificationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "verificationNotes" TEXT,
ADD COLUMN "verifiedAt" TIMESTAMP(3),
ADD COLUMN "verifiedByUserId" TEXT,
ADD COLUMN "documentKey" TEXT,
ADD COLUMN "documentFileName" TEXT,
ADD COLUMN "documentMimeType" TEXT,
ADD COLUMN "documentSizeBytes" INTEGER,
ADD COLUMN "documentUploadedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "License"
ADD CONSTRAINT "License_verifiedByUserId_fkey"
FOREIGN KEY ("verifiedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
