export const EXPERIENCE_CATEGORIES = [
  "Retail Security",
  "Event Security",
  "Construction Site Security",
  "Residential Security",
  "Corporate Office Security",
  "Warehouse Security",
  "Hospital Security",
  "School Security",
  "Night Patrol",
  "Access Control",
  "CCTV / Monitoring",
  "Crowd Control",
  "Executive Protection",
  "K9 Security",
  "Military",
  "Law Enforcement",
  "Corrections / Prison Guard",
] as const;

/** Legacy values kept for validation of existing profiles not yet migrated. */
export const LEGACY_EXPERIENCE_CATEGORIES = [
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
  "Apartment Communities",
  "Gated Communities",
  "Construction Sites",
  "Retail",
  "Shopping Mall",
  "Hospital",
  "School",
  "Hotel",
  "Bar / Nightclub",
  "Corporate Office",
  "Warehouse",
  "Fire Watch",
  "Patrol",
  "Loss Prevention",
] as const;

export const EXPERIENCE_CATEGORY_MIGRATION_MAP: Record<
  string,
  ExperienceCategory
> = {
  "Retail security": "Retail Security",
  "Event security": "Event Security",
  "Construction site security": "Construction Site Security",
  "Residential security": "Residential Security",
  "Corporate office security": "Corporate Office Security",
  "Warehouse security": "Warehouse Security",
  "Hospital security": "Hospital Security",
  "School security": "School Security",
  "Night patrol": "Night Patrol",
  "Access control": "Access Control",
  "CCTV / monitoring": "CCTV / Monitoring",
  "Crowd control": "Crowd Control",
  "Executive protection": "Executive Protection",
  "K9 security": "K9 Security",
  "Apartment Communities": "Residential Security",
  "Gated Communities": "Residential Security",
  "Construction Sites": "Construction Site Security",
  Retail: "Retail Security",
  "Shopping Mall": "Retail Security",
  Hospital: "Hospital Security",
  School: "School Security",
  "Event Security": "Event Security",
  "Bar / Nightclub": "Crowd Control",
  "Corporate Office": "Corporate Office Security",
  Warehouse: "Warehouse Security",
  "Fire Watch": "Construction Site Security",
  Patrol: "Night Patrol",
  "Executive Protection": "Executive Protection",
  "Loss Prevention": "Retail Security",
  Hotel: "Corporate Office Security",
};

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

const experienceCategorySet = new Set<string>(EXPERIENCE_CATEGORIES);

export function normalizeExperienceCategory(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return trimmed;
  }

  if (experienceCategorySet.has(trimmed)) {
    return trimmed;
  }

  return EXPERIENCE_CATEGORY_MIGRATION_MAP[trimmed] ?? trimmed;
}

export function normalizeExperienceCategories(values: readonly string[]): string[] {
  const normalized = values
    .map(normalizeExperienceCategory)
    .filter((value) => value.length > 0);

  return [...new Set(normalized)];
}

export function getExperienceCategoryFilterValues(
  category: ExperienceCategory
): string[] {
  const aliases = Object.entries(EXPERIENCE_CATEGORY_MIGRATION_MAP)
    .filter(([, canonical]) => canonical === category)
    .map(([legacy]) => legacy);

  return [category, ...aliases];
}

export function formatArmedStatusLabel(status: ArmedStatusOption) {
  return status === "ARMED" ? "Armed" : "Unarmed";
}

export function formatArmedStatuses(statuses: readonly ArmedStatusOption[]) {
  if (statuses.length === 0) {
    return "Not provided";
  }

  return statuses.map(formatArmedStatusLabel).join(" & ");
}
