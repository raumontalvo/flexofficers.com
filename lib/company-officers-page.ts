import type { ArmedStatus } from "@/app/generated/prisma/enums";
import type { OfficerSearchCardRecord } from "@/lib/officer-fields";
import { formatLicenseExpirationDate } from "@/lib/officer-licenses";
import {
  formatArmedStatuses,
  normalizeExperienceCategories,
} from "@/lib/profile-options";

export const OFFICER_BACKGROUND_FILTER_OPTIONS = [
  "Military",
  "Law Enforcement",
  "Corrections / Prison Guard",
  "Executive Protection",
  "K9",
] as const;

export const OFFICER_LICENSE_FILTER_OPTIONS = [
  "Armed Security",
  "Unarmed Security",
  "Security Guard",
  "Executive Protection",
  "K9 Security",
  "Other",
] as const;

export const OFFICER_CERTIFICATION_FILTER_OPTIONS = [
  "CPR / First Aid",
  "AED",
  "Firearms Qualification",
  "Taser",
  "Baton Certification",
  "Handcuffing",
  "ASP / Expandable Baton",
  "OC / Pepper Spray",
] as const;

export const OFFICER_AVAILABILITY_FILTER_OPTIONS = [
  "Weekdays",
  "Weekends",
  "Days",
  "Nights",
  "Overnight",
] as const;

export type OfficerSortOption = "newest" | "experience" | "alphabetical";
export type OfficerViewMode = "list" | "grid";

export type SerializedOfficerSearchResult = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profilePhotoUrl: string | null;
  city: string | null;
  state: string | null;
  cityStateLabel: string;
  armedStatusLabel: string;
  statusBadgeLabel: string;
  armedStatuses: ArmedStatus[];
  experienceYears: number | null;
  experienceYearsLabel: string;
  backgroundCategories: string[];
  experienceCategories: string[];
  licenseTypeLabels: string[];
  certifications: string[];
  availabilityLabels: string[];
  introduction: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
  licenses: {
    id: string;
    licenseType: string;
    licenseNumber: string;
    issuingState: string;
    expirationDateLabel: string;
  }[];
};

const BACKGROUND_CATEGORY_MAP: Record<
  (typeof OFFICER_BACKGROUND_FILTER_OPTIONS)[number],
  string
> = {
  Military: "Military",
  "Law Enforcement": "Law Enforcement",
  "Corrections / Prison Guard": "Corrections / Prison Guard",
  "Executive Protection": "Executive Protection",
  K9: "K9 Security",
};

export function mapBackgroundFilterToCategory(background: string) {
  return (
    BACKGROUND_CATEGORY_MAP[
      background as (typeof OFFICER_BACKGROUND_FILTER_OPTIONS)[number]
    ] ?? background
  );
}

export function mapAvailabilityFilterToStoredValue(availability: string) {
  switch (availability) {
    case "Days":
      return "Day Shift";
    case "Nights":
      return "Night Shift";
    default:
      return availability;
  }
}

export function mapStoredAvailabilityToDisplayLabel(availability: string) {
  switch (availability) {
    case "Day Shift":
      return "Days";
    case "Night Shift":
      return "Nights";
    default:
      return availability;
  }
}

export function getOfficerBackgroundCategories(
  experienceCategories: readonly string[]
) {
  const normalized = normalizeExperienceCategories(experienceCategories);
  const backgroundSet = new Set(
    Object.values(BACKGROUND_CATEGORY_MAP).concat(["K9 Security"])
  );

  return normalized.filter((category) => backgroundSet.has(category));
}

export function getOfficerStatusBadge(input: {
  licenseTypeLabels: readonly string[];
  armedStatuses: readonly ArmedStatus[];
}) {
  if (input.licenseTypeLabels.length > 0) {
    return input.licenseTypeLabels[0];
  }

  const hasArmed = input.armedStatuses.includes("ARMED");
  const hasUnarmed = input.armedStatuses.includes("UNARMED");

  if (hasArmed && hasUnarmed) {
    return "Armed & Unarmed Security";
  }

  if (hasArmed) {
    return "Armed Security";
  }

  if (hasUnarmed) {
    return "Unarmed Security";
  }

  return "Officer";
}

export type OfficerLicenseChipTone = "blue" | "green" | "neutral";

export function getOfficerLicenseChipTone(
  licenseType: string
): OfficerLicenseChipTone {
  if (licenseType === "Unarmed Security") {
    return "blue";
  }

  if (licenseType === "Armed Security") {
    return "green";
  }

  return "neutral";
}

export function getOfficerLicenseChipDisplay(
  licenseTypeLabels: readonly string[]
) {
  if (licenseTypeLabels.length === 0) {
    return { chips: [] as string[], overflowCount: 0 };
  }

  if (licenseTypeLabels.length <= 2) {
    return { chips: [...licenseTypeLabels], overflowCount: 0 };
  }

  return {
    chips: licenseTypeLabels.slice(0, 2),
    overflowCount: licenseTypeLabels.length - 2,
  };
}

export function serializeOfficerSearchResult(
  officer: OfficerSearchCardRecord & {
    state?: string | null;
    createdAt?: Date;
    user?: { email: string | null };
  }
): SerializedOfficerSearchResult {
  const city = officer.city?.trim() || null;
  const state = officer.state?.trim() || null;
  const cityStateLabel =
    [city, state].filter(Boolean).join(", ") || "Location not provided";
  const licenseTypeLabels = [
    ...new Set(officer.licenses.map((license) => license.licenseType)),
  ];

  return {
    id: officer.id,
    firstName: officer.firstName,
    lastName: officer.lastName,
    fullName: `${officer.firstName} ${officer.lastName}`.trim(),
    profilePhotoUrl: officer.profilePhotoUrl,
    city,
    state,
    cityStateLabel,
    armedStatusLabel: formatArmedStatuses(officer.armedStatuses),
    statusBadgeLabel: getOfficerStatusBadge({
      licenseTypeLabels,
      armedStatuses: officer.armedStatuses,
    }),
    armedStatuses: [...officer.armedStatuses],
    experienceYears: officer.experienceYears,
    experienceYearsLabel:
      officer.experienceYears !== null && officer.experienceYears !== undefined
        ? `${officer.experienceYears} years`
        : "Not provided",
    backgroundCategories: getOfficerBackgroundCategories(
      officer.experienceCategories
    ),
    experienceCategories: normalizeExperienceCategories(
      officer.experienceCategories
    ),
    licenseTypeLabels,
    certifications: [...officer.certifications],
    availabilityLabels: officer.availability.map(mapStoredAvailabilityToDisplayLabel),
    introduction: officer.introduction?.trim() || null,
    email: officer.user?.email?.trim() || null,
    phone: officer.phone?.trim() || null,
    createdAt: officer.createdAt?.toISOString() ?? "",
    licenses: officer.licenses.map((license) => ({
      id: license.id,
      licenseType: license.licenseType,
      licenseNumber: license.licenseNumber,
      issuingState: license.issuingState,
      expirationDateLabel: formatLicenseExpirationDate(license.expirationDate),
    })),
  };
}

export function sortOfficerSearchResults(
  officers: SerializedOfficerSearchResult[],
  sort: OfficerSortOption
) {
  const sorted = [...officers];

  switch (sort) {
    case "experience":
      return sorted.sort((left, right) => {
        const leftYears = left.experienceYears ?? -1;
        const rightYears = right.experienceYears ?? -1;

        if (rightYears !== leftYears) {
          return rightYears - leftYears;
        }

        return left.fullName.localeCompare(right.fullName);
      });
    case "newest":
      return sorted.sort((left, right) => {
        const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
        const rightTime = right.createdAt
          ? new Date(right.createdAt).getTime()
          : 0;

        if (rightTime !== leftTime) {
          return rightTime - leftTime;
        }

        return left.fullName.localeCompare(right.fullName);
      });
    case "alphabetical":
    default:
      return sorted.sort((left, right) =>
        left.fullName.localeCompare(right.fullName)
      );
  }
}
