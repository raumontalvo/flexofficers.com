import { ArmedStatus, Prisma, UserRole } from "@/app/generated/prisma/client";
import {
  mapAvailabilityFilterToStoredValue,
  mapBackgroundFilterToCategory,
  OFFICER_AVAILABILITY_FILTER_OPTIONS,
  OFFICER_BACKGROUND_FILTER_OPTIONS,
  OFFICER_CERTIFICATION_FILTER_OPTIONS,
} from "@/lib/company-officers-page";
import { LICENSE_TYPE_OPTIONS, US_STATES } from "@/lib/license-options";
import {
  AVAILABILITY_OPTIONS,
  CERTIFICATION_OPTIONS,
  EXPERIENCE_CATEGORIES,
  getExperienceCategoryFilterValues,
  type ExperienceCategory,
} from "@/lib/profile-options";

export type OfficerSearchFilters = {
  name?: string;
  city?: string;
  state?: string;
  backgrounds?: string[];
  licenseTypes?: string[];
  certifications?: string[];
  availabilities?: string[];
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

function readParamList(value: SearchParamValue) {
  if (!value) {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];

  return [
    ...new Set(
      values
        .flatMap((entry) => entry.split(","))
        .map((entry) => entry.trim())
        .filter(Boolean)
    ),
  ];
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

export function resolveOfficerStateQuery(stateInput: string) {
  const trimmed = stateInput.trim();

  if (!trimmed) {
    return null;
  }

  if (/^[A-Za-z]{2}$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  const matchedState = US_STATES.find(
    (state) => state.name.toLowerCase() === trimmed.toLowerCase()
  );

  if (matchedState) {
    return matchedState.code;
  }

  return trimmed;
}

export function parseOfficerSearchFilters(
  searchParams: Record<string, SearchParamValue>
): OfficerSearchFilters {
  const filters: OfficerSearchFilters = {};

  const name = readParam(searchParams.name);
  if (name) {
    filters.name = name;
  }

  const city = readParam(searchParams.city);
  if (city) {
    filters.city = city;
  }

  const state = readParam(searchParams.state);
  if (state) {
    filters.state = state;
  }

  const backgrounds = readParamList(searchParams.background).filter((value) =>
    isAllowedOption(value, OFFICER_BACKGROUND_FILTER_OPTIONS)
  );
  if (backgrounds.length > 0) {
    filters.backgrounds = backgrounds;
  }

  const licenseTypes = readParamList(searchParams.licenseType).filter((value) =>
    isAllowedOption(value, LICENSE_TYPE_OPTIONS)
  );
  if (licenseTypes.length > 0) {
    filters.licenseTypes = licenseTypes;
  }

  const certifications = readParamList(searchParams.certification).filter(
    (value) =>
      isAllowedOption(value, OFFICER_CERTIFICATION_FILTER_OPTIONS) ||
      isAllowedOption(value, CERTIFICATION_OPTIONS)
  );
  if (certifications.length > 0) {
    filters.certifications = certifications;
  }

  const availabilities = readParamList(searchParams.availability).filter(
    (value) =>
      isAllowedOption(value, OFFICER_AVAILABILITY_FILTER_OPTIONS) ||
      isAllowedOption(value, AVAILABILITY_OPTIONS)
  );
  if (availabilities.length > 0) {
    filters.availabilities = availabilities;
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

  if (filters.name) {
    where.OR = [
      { firstName: { contains: filters.name, mode: "insensitive" } },
      { lastName: { contains: filters.name, mode: "insensitive" } },
    ];
  }

  if (filters.city) {
    where.city = {
      contains: filters.city,
      mode: "insensitive",
    };
  }

  if (filters.state) {
    const resolvedState = resolveOfficerStateQuery(filters.state);

    if (resolvedState) {
      if (/^[A-Z]{2}$/.test(resolvedState)) {
        where.state = {
          equals: resolvedState,
          mode: "insensitive",
        };
      } else {
        where.state = {
          contains: resolvedState,
          mode: "insensitive",
        };
      }
    }
  }

  if (filters.backgrounds?.length) {
    const categoryValues = [
      ...new Set(
        filters.backgrounds.flatMap((background) =>
          getExperienceCategoryFilterValues(
            mapBackgroundFilterToCategory(background) as ExperienceCategory
          )
        )
      ),
    ];

    where.experienceCategories = {
      hasSome: categoryValues,
    };
  } else if (filters.experienceCategory) {
    const filterValues = getExperienceCategoryFilterValues(
      filters.experienceCategory
    );

    where.experienceCategories =
      filterValues.length === 1
        ? { has: filterValues[0] }
        : { hasSome: filterValues };
  }

  if (filters.licenseTypes?.length) {
    where.licenses = {
      some: {
        licenseType: {
          in: filters.licenseTypes,
        },
      },
    };
  }

  const certificationFilters = [
    ...(filters.certifications ?? []),
    ...(filters.certification ? [filters.certification] : []),
  ];

  if (certificationFilters.length === 1) {
    where.certifications = {
      has: certificationFilters[0],
    };
  } else if (certificationFilters.length > 1) {
    where.certifications = {
      hasSome: certificationFilters,
    };
  }

  const availabilityFilters = [
    ...(filters.availabilities?.map(mapAvailabilityFilterToStoredValue) ?? []),
    ...(filters.availability ? [filters.availability] : []),
  ];

  if (availabilityFilters.length === 1) {
    where.availability = {
      has: availabilityFilters[0],
    };
  } else if (availabilityFilters.length > 1) {
    where.availability = {
      hasSome: [...new Set(availabilityFilters)],
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

  return where;
}
