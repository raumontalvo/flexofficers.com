-- Migrate legacy Officer.licenseExpirationDate into License records.
INSERT INTO "License" (
  "id",
  "officerId",
  "licenseType",
  "licenseNumber",
  "expirationDate",
  "issuingState",
  "verified",
  "verificationStatus",
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  o."id",
  'Security Officer License',
  'MIGRATED',
  o."licenseExpirationDate",
  COALESCE(NULLIF(TRIM(o."state"), ''), 'FL'),
  false,
  'PENDING',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Officer" o
WHERE o."licenseExpirationDate" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM "License" l
    WHERE l."officerId" = o."id"
  );

-- Officers with expiration but no state still need a valid expiration on License rows.
UPDATE "License"
SET "expirationDate" = o."licenseExpirationDate"
FROM "Officer" o
WHERE "License"."officerId" = o."id"
  AND o."licenseExpirationDate" IS NOT NULL
  AND "License"."expirationDate" IS NULL;

-- Backfill any remaining null expiration dates before enforcing NOT NULL.
UPDATE "License"
SET "expirationDate" = CURRENT_TIMESTAMP
WHERE "expirationDate" IS NULL;

-- Drop legacy single-license column from Officer.
ALTER TABLE "Officer" DROP COLUMN "licenseExpirationDate";

-- Require expiration date on each license.
ALTER TABLE "License" ALTER COLUMN "expirationDate" SET NOT NULL;
