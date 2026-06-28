-- AlterEnum
ALTER TYPE "ShiftStatus" ADD VALUE 'INVITED';
ALTER TYPE "ShiftStatus" ADD VALUE 'PARTIALLY_FILLED';

-- AlterTable
ALTER TABLE "ShiftInvite" ADD COLUMN "message" TEXT;
