-- AlterTable
ALTER TABLE "Client" ADD COLUMN "profilePhotoUrl" TEXT;
ALTER TABLE "Client" ADD COLUMN "industry" TEXT;
ALTER TABLE "Client" ADD COLUMN "website" TEXT;
ALTER TABLE "Client" ADD COLUMN "address" TEXT;
ALTER TABLE "Client" ADD COLUMN "city" TEXT;
ALTER TABLE "Client" ADD COLUMN "state" TEXT;
ALTER TABLE "Client" ADD COLUMN "zipCode" TEXT;
ALTER TABLE "Client" ADD COLUMN "country" TEXT;
ALTER TABLE "Client" ADD COLUMN "notifyNewApplications" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Client" ADD COLUMN "notifyMessages" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Client" ADD COLUMN "notifyMarketing" BOOLEAN NOT NULL DEFAULT false;
