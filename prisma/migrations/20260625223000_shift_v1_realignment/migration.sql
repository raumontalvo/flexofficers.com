-- AlterTable
ALTER TABLE "Shift" RENAME COLUMN "requiredLicense" TO "specialRequirements";

-- AlterTable
ALTER TABLE "Shift" ADD COLUMN "reportingInstructions" TEXT;
