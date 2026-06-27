import { ArmedStatus, Prisma, UserRole } from "@/app/generated/prisma/client";
import {
  AVAILABILITY_OPTIONS,
  CERTIFICATION_OPTIONS,
  EXPERIENCE_CATEGORIES,
  getExperienceCategoryFilterValues,
  type ExperienceCategory,
} from "@/lib/profile-options";

export type OfficerSearchFilters = {
  city?: string;
  armedStatuses?: ArmedStatus[];
  minExperienceYears?: number;
  certification?: string;
  availability?: string;
  experienceCategory?: ExperienceCategory;
};

type SearchParamValue = string | string[] | undefined;

function readParam(value: SearchParamValue) {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function isAllowedOption(value: string, options: readonly string[]) {
  return options.includes(value);
}

function parseArmedStatusFilter(value: string): ArmedStatus | undefined {
  const normalized = value.toUpperCase();

  if (normalized === ArmedStatus.ARMED || normalized === ArmedStatus.UNARMED) {
    return normalized as ArmedStatus;
  }

  return undefined;
}

export function parseOfficerSearchFilters(
  searchParams: Record<string, SearchParamValue>
): OfficerSearchFilters {
  const filters: OfficerSearchFilters = {};

  const city = readParam(searchParams.city);
  if (city) {
    filters.city = city;
  }

  const selectedArmedStatus = parseArmedStatusFilter(
    readParam(searchParams.armedStatuses)
  );

  if (selectedArmedStatus) {
    filters.armedStatuses = [selectedArmedStatus];
  }

  const minExperienceYearsRaw = readParam(searchParams.minExperienceYears);
  if (minExperienceYearsRaw) {
    const parsed = Number(minExperienceYearsRaw);
    if (Number.isFinite(parsed) && parsed >= 0) {
      filters.minExperienceYears = parsed;
    }
  }

  const certification = readParam(searchParams.certification);
  if (certification && isAllowedOption(certification, CERTIFICATION_OPTIONS)) {
    filters.certification = certification;
  }

  const availability = readParam(searchParams.availability);
  if (availability && isAllowedOption(availability, AVAILABILITY_OPTIONS)) {
    filters.availability = availability;
  }

  const experienceCategory = readParam(searchParams.experienceCategory);
  if (
    experienceCategory &&
    isAllowedOption(experienceCategory, EXPERIENCE_CATEGORIES)
  ) {
    filters.experienceCategory = experienceCategory as ExperienceCategory;
  }

  return filters;
}

export function buildOfficerSearchWhere(
  filters: OfficerSearchFilters
): Prisma.OfficerWhereInput {
  const where: Prisma.OfficerWhereInput = {
    user: {
      role: UserRole.OFFICER,
    },
  };

  if (filters.city) {
    where.city = {
      contains: filters.city,
      mode: "insensitive",
    };
  }

  if (filters.armedStatuses?.length === 1) {
    where.armedStatuses = {
      has: filters.armedStatuses[0],
    };
  } else if (filters.armedStatuses && filters.armedStatuses.length > 1) {
    where.armedStatuses = {
      hasSome: filters.armedStatuses,
    };
  }

  if (typeof filters.minExperienceYears === "number") {
    where.experienceYears = {
      gte: filters.minExperienceYears,
    };
  }

  if (filters.certification) {
    where.certifications = {
      has: filters.certification,
    };
  }

  if (filters.availability) {
    where.availability = {
      has: filters.availability,
    };
  }

  if (filters.experienceCategory) {
    const filterValues = getExperienceCategoryFilterValues(
      filters.experienceCategory
    );

    where.experienceCategories =
      filterValues.length === 1
        ? { has: filterValues[0] }
        : { hasSome: filterValues };
  }

  return where;
}
