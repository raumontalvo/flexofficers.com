DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'CompanySubscriptionStatus'
      AND e.enumlabel = 'TRIALING'
  ) THEN
    ALTER TYPE "CompanySubscriptionStatus" ADD VALUE 'TRIALING';
  END IF;
END $$;

ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "subscriptionPriceId" TEXT;
