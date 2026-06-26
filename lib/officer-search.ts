import { ArmedStatus, Prisma, UserRole } from "@/app/generated/prisma/client";
import {
  AVAILABILITY_OPTIONS,
  CERTIFICATION_OPTIONS,
  EXPERIENCE_CATEGORIES,
} from "@/lib/profile-options";

export type OfficerSearchFilters = {
  city?: string;
  armedStatus?: ArmedStatus;
  minExperienceYears?: number;
  certification?: string;
  availability?: string;
  experienceCategory?: string;
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

export function parseOfficerSearchFilters(
  searchParams: Record<string, SearchParamValue>
): OfficerSearchFilters {
  const filters: OfficerSearchFilters = {};

  const city = readParam(searchParams.city);
  if (city) {
    filters.city = city;
  }

  const armedStatusRaw = readParam(searchParams.armedStatus).toUpperCase();
  if (armedStatusRaw === ArmedStatus.ARMED || armedStatusRaw === ArmedStatus.UNARMED) {
    filters.armedStatus = armedStatusRaw as ArmedStatus;
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
    filters.experienceCategory = experienceCategory;
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

  if (filters.armedStatus) {
    where.armedStatus = filters.armedStatus;
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
    where.experienceCategories = {
      has: filters.experienceCategory,
    };
  }

  return where;
}
