-- CreateEnum
CREATE TYPE "ShiftVisibility" AS ENUM ('PUBLIC', 'STAFF_ONLY');

-- AlterTable
ALTER TABLE "Shift" ADD COLUMN "visibility" "ShiftVisibility" NOT NULL DEFAULT 'PUBLIC';

-- CreateTable
CREATE TABLE "CompanyStaff" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyStaff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyStaff_companyId_officerId_key" ON "CompanyStaff"("companyId", "officerId");

-- AddForeignKey
ALTER TABLE "CompanyStaff" ADD CONSTRAINT "CompanyStaff_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyStaff" ADD CONSTRAINT "CompanyStaff_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "Officer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
