-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'CLIENT';

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('OPEN', 'FILLED', 'CANCELLED');
CREATE TYPE "LeadPaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');
CREATE TYPE "LeadUrgency" AS ENUM ('STANDARD', 'URGENT');
CREATE TYPE "LeadPostType" AS ENUM ('PUBLIC');
CREATE TYPE "LeadApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contactName" TEXT,
    "companyName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityLead" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "companyName" TEXT,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "serviceNeeded" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "dateNeeded" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "officersNeeded" INTEGER NOT NULL DEFAULT 1,
    "budgetOffer" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "urgency" "LeadUrgency" NOT NULL DEFAULT 'STANDARD',
    "postType" "LeadPostType" NOT NULL DEFAULT 'PUBLIC',
    "status" "LeadStatus" NOT NULL DEFAULT 'OPEN',
    "paymentStatus" "LeadPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "stripeCheckoutSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecurityLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityLeadApplication" (
    "id" TEXT NOT NULL,
    "securityLeadId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "message" TEXT,
    "status" "LeadApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecurityLeadApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");
CREATE UNIQUE INDEX "SecurityLead_stripeCheckoutSessionId_key" ON "SecurityLead"("stripeCheckoutSessionId");
CREATE INDEX "SecurityLead_status_paymentStatus_idx" ON "SecurityLead"("status", "paymentStatus");
CREATE INDEX "SecurityLead_clientId_idx" ON "SecurityLead"("clientId");
CREATE UNIQUE INDEX "SecurityLeadApplication_securityLeadId_companyId_key" ON "SecurityLeadApplication"("securityLeadId", "companyId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SecurityLead" ADD CONSTRAINT "SecurityLead_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SecurityLeadApplication" ADD CONSTRAINT "SecurityLeadApplication_securityLeadId_fkey" FOREIGN KEY ("securityLeadId") REFERENCES "SecurityLead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SecurityLeadApplication" ADD CONSTRAINT "SecurityLeadApplication_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
