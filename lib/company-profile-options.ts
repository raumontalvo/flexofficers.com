export const COMPANY_PROFILE_SERVICES = [
  "Armed Security",
  "Unarmed Security",
  "Event Security",
  "Corporate Security",
  "Construction Security",
  "Retail & Loss Prevention",
  "Executive Protection",
  "Mobile Patrol",
  "Gate Access Control",
  "K9 Services",
  "Fire Watch",
  "24/7 Monitoring & Support",
] as const;

export const COMPANY_OFFICER_BENEFITS = [
  "Weekly Pay",
  "Flexible Scheduling",
  "Advancement Opportunities",
  "Overtime Available",
  "Training Provided",
  "Professional Environment",
] as const;

export const COMPANY_WORK_ENVIRONMENT = [
  "Professional",
  "Team-Oriented",
  "Fast Paced",
  "Customer Facing",
  "Indoor & Outdoor",
  "Overnight Available",
  "Overtime Available",
  "Flexible Scheduling",
] as const;

export function filterKnownProfileSelections(
  values: string[],
  options: readonly string[]
) {
  const allowed = new Set<string>(options);

  return values.filter((value) => allowed.has(value));
}

export function buildCompanyServices(shifts: { requirements: string[] }[]) {
  const values = new Set<string>();

  for (const shift of shifts) {
    for (const requirement of shift.requirements) {
      const trimmed = requirement.trim();
      if (trimmed) {
        values.add(trimmed);
      }
    }
  }

  return COMPANY_PROFILE_SERVICES.filter((service) => values.has(service));
}
