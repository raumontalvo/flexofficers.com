export const EXPERIENCE_CATEGORIES = [
  "Retail security",
  "Event security",
  "Construction site security",
  "Residential security",
  "Corporate office security",
  "Warehouse security",
  "Hospital security",
  "School security",
  "Night patrol",
  "Access control",
  "CCTV / monitoring",
  "Crowd control",
  "Executive protection",
  "K9 security",
] as const;

/** Legacy values kept for validation of migrated/existing profiles. */
export const LEGACY_EXPERIENCE_CATEGORIES = [
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

export const ALL_EXPERIENCE_CATEGORIES = [
  ...EXPERIENCE_CATEGORIES,
  ...LEGACY_EXPERIENCE_CATEGORIES,
] as const;

export const ARMED_STATUS_OPTIONS = ["ARMED", "UNARMED"] as const;

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
export type ArmedStatusOption = (typeof ARMED_STATUS_OPTIONS)[number];
export type CertificationOption = (typeof CERTIFICATION_OPTIONS)[number];
export type AvailabilityOption = (typeof AVAILABILITY_OPTIONS)[number];

export function formatArmedStatusLabel(status: ArmedStatusOption) {
  return status === "ARMED" ? "Armed" : "Unarmed";
}

export function formatArmedStatuses(statuses: readonly ArmedStatusOption[]) {
  if (statuses.length === 0) {
    return "Not provided";
  }

  return statuses.map(formatArmedStatusLabel).join(" & ");
}
