-- Remap experience category labels to the current canonical options.
UPDATE "Officer"
SET "experienceCategories" = (
  SELECT COALESCE(array_agg(DISTINCT mapped_value ORDER BY mapped_value), ARRAY[]::TEXT[])
  FROM (
    SELECT CASE unnested
      WHEN 'Retail security' THEN 'Retail Security'
      WHEN 'Event security' THEN 'Event Security'
      WHEN 'Construction site security' THEN 'Construction Site Security'
      WHEN 'Residential security' THEN 'Residential Security'
      WHEN 'Corporate office security' THEN 'Corporate Office Security'
      WHEN 'Warehouse security' THEN 'Warehouse Security'
      WHEN 'Hospital security' THEN 'Hospital Security'
      WHEN 'School security' THEN 'School Security'
      WHEN 'Night patrol' THEN 'Night Patrol'
      WHEN 'Access control' THEN 'Access Control'
      WHEN 'CCTV / monitoring' THEN 'CCTV / Monitoring'
      WHEN 'Crowd control' THEN 'Crowd Control'
      WHEN 'Executive protection' THEN 'Executive Protection'
      WHEN 'K9 security' THEN 'K9 Security'
      WHEN 'Apartment Communities' THEN 'Residential Security'
      WHEN 'Gated Communities' THEN 'Residential Security'
      WHEN 'Construction Sites' THEN 'Construction Site Security'
      WHEN 'Retail' THEN 'Retail Security'
      WHEN 'Shopping Mall' THEN 'Retail Security'
      WHEN 'Hospital' THEN 'Hospital Security'
      WHEN 'School' THEN 'School Security'
      WHEN 'Event Security' THEN 'Event Security'
      WHEN 'Bar / Nightclub' THEN 'Crowd Control'
      WHEN 'Corporate Office' THEN 'Corporate Office Security'
      WHEN 'Warehouse' THEN 'Warehouse Security'
      WHEN 'Fire Watch' THEN 'Construction Site Security'
      WHEN 'Patrol' THEN 'Night Patrol'
      WHEN 'Executive Protection' THEN 'Executive Protection'
      WHEN 'Loss Prevention' THEN 'Retail Security'
      WHEN 'Hotel' THEN 'Corporate Office Security'
      ELSE unnested
    END AS mapped_value
    FROM unnest("experienceCategories") AS unnested
  ) sub
)
WHERE cardinality("experienceCategories") > 0;
