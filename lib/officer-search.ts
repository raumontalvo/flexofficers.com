import { ArmedStatus, Prisma } from "@/app/generated/prisma/client";
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
import { buildOfficerProfileCompleteWhere } from "@/lib/officer-profile-completion";

export type OfficerSearchFilters = {
  search?: string;
  firstName?: string;
  lastName?: string;
  /** @deprecated Use firstName and lastName instead. */
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

  const search = readParam(searchParams.search);
  if (search) {
    filters.search = search;
  }

  const firstName = readParam(searchParams.firstName);
  if (firstName) {
    filters.firstName = firstName;
  }

  const lastName = readParam(searchParams.lastName);
  if (lastName) {
    filters.lastName = lastName;
  }

  const name = readParam(searchParams.name);
  if (name && !firstName && !lastName) {
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

export function buildOfficerNameSearchWhere(filters: {
  firstName?: string;
  lastName?: string;
  name?: string;
}): Prisma.OfficerWhereInput {
  const firstName = filters.firstName?.trim();
  const lastName = filters.lastName?.trim();

  if (firstName && lastName) {
    return {
      AND: [
        { firstName: { contains: firstName, mode: "insensitive" } },
        { lastName: { contains: lastName, mode: "insensitive" } },
      ],
    };
  }

  if (firstName) {
    return {
      firstName: { contains: firstName, mode: "insensitive" },
    };
  }

  if (lastName) {
    return {
      lastName: { contains: lastName, mode: "insensitive" },
    };
  }

  const legacyName = filters.name?.trim();

  if (!legacyName) {
    return {};
  }

  const terms = legacyName.split(/\s+/).filter(Boolean);

  if (terms.length >= 2) {
    const [first, ...rest] = terms;
    const last = rest.join(" ");

    return {
      AND: [
        { firstName: { contains: first, mode: "insensitive" } },
        { lastName: { contains: last, mode: "insensitive" } },
      ],
    };
  }

  return {
    OR: [
      { firstName: { contains: legacyName, mode: "insensitive" } },
      { lastName: { contains: legacyName, mode: "insensitive" } },
    ],
  };
}

export function buildOfficerQuickSearchWhere(
  search: string
): Prisma.OfficerWhereInput {
  const trimmed = search.trim();

  if (!trimmed) {
    return {};
  }

  const terms = trimmed.split(/\s+/).filter(Boolean);

  if (terms.length >= 2) {
    const [first, ...rest] = terms;
    const last = rest.join(" ");

    return {
      OR: [
        {
          AND: [
            { firstName: { contains: first, mode: "insensitive" } },
            { lastName: { contains: last, mode: "insensitive" } },
          ],
        },
        { city: { contains: trimmed, mode: "insensitive" } },
      ],
    };
  }

  return {
    OR: [
      { firstName: { contains: trimmed, mode: "insensitive" } },
      { lastName: { contains: trimmed, mode: "insensitive" } },
      { city: { contains: trimmed, mode: "insensitive" } },
    ],
  };
}

export function buildOfficerSearchWhere(
  filters: OfficerSearchFilters
): Prisma.OfficerWhereInput {
  const where: Prisma.OfficerWhereInput = {};

  if (filters.firstName || filters.lastName || filters.name) {
    Object.assign(
      where,
      buildOfficerNameSearchWhere({
        firstName: filters.firstName,
        lastName: filters.lastName,
        name: filters.name,
      })
    );
  } else if (filters.search) {
    Object.assign(where, buildOfficerQuickSearchWhere(filters.search));
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

  return {
    AND: [buildOfficerProfileCompleteWhere(), where],
  };
}
