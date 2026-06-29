import type { OfficerSearchFilters } from "@/lib/officer-search";

export function getOfficerQuickSearchDisplay(filters: OfficerSearchFilters) {
  if (filters.search) {
    return filters.search;
  }

  const nameParts = [filters.firstName, filters.lastName].filter(Boolean);

  if (nameParts.length > 0) {
    return nameParts.join(" ");
  }

  return filters.city ?? "";
}

export function countAdvancedOfficerFilters(filters: OfficerSearchFilters) {
  let count = 0;

  if (filters.firstName) count += 1;
  if (filters.lastName) count += 1;
  if (filters.city) count += 1;
  if (filters.state) count += 1;
  if (filters.backgrounds?.length) count += 1;
  if (filters.licenseTypes?.length) count += 1;
  if (filters.certifications?.length) count += 1;
  if (filters.availabilities?.length) count += 1;
  if (filters.armedStatuses?.length) count += 1;
  if (typeof filters.minExperienceYears === "number") count += 1;
  if (filters.experienceCategory) count += 1;

  return count;
}

export function buildOfficerSearchQuery(filters: OfficerSearchFilters) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.firstName) {
    params.set("firstName", filters.firstName);
  }

  if (filters.lastName) {
    params.set("lastName", filters.lastName);
  }

  if (filters.name) {
    params.set("name", filters.name);
  }

  if (filters.city) {
    params.set("city", filters.city);
  }

  if (filters.state) {
    params.set("state", filters.state);
  }

  for (const background of filters.backgrounds ?? []) {
    params.append("background", background);
  }

  for (const licenseType of filters.licenseTypes ?? []) {
    params.append("licenseType", licenseType);
  }

  for (const certification of filters.certifications ?? []) {
    params.append("certification", certification);
  }

  for (const availability of filters.availabilities ?? []) {
    params.append("availability", availability);
  }

  if (filters.armedStatuses?.[0]) {
    params.set("armedStatuses", filters.armedStatuses[0].toLowerCase());
  }

  if (typeof filters.minExperienceYears === "number") {
    params.set("minExperienceYears", String(filters.minExperienceYears));
  }

  if (filters.experienceCategory) {
    params.set("experienceCategory", filters.experienceCategory);
  }

  return params;
}
