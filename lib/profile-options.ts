export const EXPERIENCE_CATEGORIES = [
  "Apartment Communities",
  "Gated Communities",
  "Construction Sites",
  "Retail",
  "Shopping Mall",
  "Hospital",
  "School",
  "Hotel",
  "Event Security",
  "Bar / Nightclub",
  "Corporate Office",
  "Warehouse",
  "Fire Watch",
  "Patrol",
  "Executive Protection",
  "Loss Prevention",
] as const;

export const CERTIFICATION_OPTIONS = [
  "CPR / First Aid",
  "AED",
  "Baton Certification",
  "OC / Pepper Spray",
  "Handcuffing",
  "Firearms Qualification",
  "Taser",
  "ASP / Expandable Baton",
] as const;

export const AVAILABILITY_OPTIONS = [
  "Weekdays",
  "Weekends",
  "Day Shift",
  "Night Shift",
  "Overnight",
  "On-Call",
  "Full-Time",
  "Part-Time",
] as const;

export type ExperienceCategory = (typeof EXPERIENCE_CATEGORIES)[number];
export type CertificationOption = (typeof CERTIFICATION_OPTIONS)[number];
export type AvailabilityOption = (typeof AVAILABILITY_OPTIONS)[number];
