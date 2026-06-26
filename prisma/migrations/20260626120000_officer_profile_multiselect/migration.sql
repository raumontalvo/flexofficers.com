-- AlterTable: armedStatus -> armedStatuses (multi-select)
ALTER TABLE "Officer" ADD COLUMN "armedStatuses" "ArmedStatus"[] DEFAULT ARRAY[]::"ArmedStatus"[];

UPDATE "Officer"
SET "armedStatuses" = ARRAY["armedStatus"]::"ArmedStatus"[]
WHERE "armedStatus" IS NOT NULL;

ALTER TABLE "Officer" DROP COLUMN "armedStatus";

-- Remap legacy experience category labels to the new options
UPDATE "Officer"
SET "experienceCategories" = (
  SELECT COALESCE(array_agg(DISTINCT mapped_value ORDER BY mapped_value), ARRAY[]::TEXT[])
  FROM (
    SELECT CASE unnested
      WHEN 'Apartment Communities' THEN 'Residential security'
      WHEN 'Gated Communities' THEN 'Residential security'
      WHEN 'Construction Sites' THEN 'Construction site security'
      WHEN 'Retail' THEN 'Retail security'
      WHEN 'Shopping Mall' THEN 'Retail security'
      WHEN 'Hospital' THEN 'Hospital security'
      WHEN 'School' THEN 'School security'
      WHEN 'Event Security' THEN 'Event security'
      WHEN 'Bar / Nightclub' THEN 'Crowd control'
      WHEN 'Corporate Office' THEN 'Corporate office security'
      WHEN 'Warehouse' THEN 'Warehouse security'
      WHEN 'Patrol' THEN 'Night patrol'
      WHEN 'Executive Protection' THEN 'Executive protection'
      WHEN 'Loss Prevention' THEN 'Retail security'
      ELSE unnested
    END AS mapped_value
    FROM unnest("experienceCategories") AS unnested
  ) sub
)
WHERE cardinality("experienceCategories") > 0;
