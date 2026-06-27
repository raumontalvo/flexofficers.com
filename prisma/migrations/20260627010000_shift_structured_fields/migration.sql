-- CreateEnum
CREATE TYPE "ShiftWorkType" AS ENUM ('GIG', 'FULL_TIME', 'PART_TIME');

-- CreateEnum
CREATE TYPE "ShiftTimeType" AS ENUM ('DAY_SHIFT', 'NIGHT_SHIFT', 'OVERNIGHT');

-- CreateEnum
CREATE TYPE "ShiftArmedRequirement" AS ENUM ('ARMED', 'UNARMED', 'EITHER');

-- AlterTable
ALTER TABLE "Shift"
ADD COLUMN "workType" "ShiftWorkType",
ADD COLUMN "shiftTimeType" "ShiftTimeType",
ADD COLUMN "armedRequirement" "ShiftArmedRequirement",
ADD COLUMN "requirements" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "otherRequirements" TEXT;
