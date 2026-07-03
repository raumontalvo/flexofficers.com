-- AlterTable
ALTER TABLE "Shift" ADD COLUMN "recurringScheduleId" TEXT;

-- CreateIndex
CREATE INDEX "Shift_recurringScheduleId_idx" ON "Shift"("recurringScheduleId");
