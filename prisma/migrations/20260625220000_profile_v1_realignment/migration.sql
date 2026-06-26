-- CreateEnum
CREATE TYPE "ArmedStatus" AS ENUM ('ARMED', 'UNARMED');

-- AlterTable
ALTER TABLE "Officer"
ADD COLUMN "profilePhotoUrl" TEXT,
ADD COLUMN "armedStatus" "ArmedStatus",
ADD COLUMN "licenseExpirationDate" TIMESTAMP(3),
ADD COLUMN "availability" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "certifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "experienceCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "introduction" TEXT;

-- AlterTable
ALTER TABLE "Company"
ADD COLUMN "email" TEXT,
ADD COLUMN "address" TEXT,
ADD COLUMN "logoUrl" TEXT;
