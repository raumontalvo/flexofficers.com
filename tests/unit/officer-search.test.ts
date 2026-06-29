import { describe, expect, it } from "vitest";
import { ArmedStatus } from "@/app/generated/prisma/enums";
import {
  buildOfficerNameSearchWhere,
  buildOfficerSearchWhere,
  parseOfficerSearchFilters,
  resolveOfficerStateQuery,
} from "@/lib/officer-search";

describe("parseOfficerSearchFilters", () => {
  it("parses valid filter values", () => {
    const filters = parseOfficerSearchFilters({
      city: " Miami ",
      armedStatuses: "armed",
      minExperienceYears: "3",
      certification: "CPR / First Aid",
      availability: "Night Shift",
      experienceCategory: "Hospital Security",
    });

    expect(filters).toEqual({
      city: "Miami",
      armedStatuses: [ArmedStatus.ARMED],
      minExperienceYears: 3,
      certifications: ["CPR / First Aid"],
      availabilities: ["Night Shift"],
      experienceCategory: "Hospital Security",
    });
  });

  it("parses first name, last name, state, and multi-select filters", () => {
    const filters = parseOfficerSearchFilters({
      firstName: "Raul",
      lastName: "Martinez",
      city: "Fort Myers",
      state: "Florida",
      background: ["Military", "K9"],
      licenseType: "Armed Security",
      certification: ["CPR / First Aid", "Taser"],
      availability: ["Weekdays", "Days"],
    });

    expect(filters).toEqual({
      firstName: "Raul",
      lastName: "Martinez",
      city: "Fort Myers",
      state: "Florida",
      backgrounds: ["Military", "K9"],
      licenseTypes: ["Armed Security"],
      certifications: ["CPR / First Aid", "Taser"],
      availabilities: ["Weekdays", "Days"],
    });
  });

  it("keeps legacy name filter when first and last are absent", () => {
    const filters = parseOfficerSearchFilters({
      name: "Raul",
      city: "Fort Myers",
    });

    expect(filters).toEqual({
      name: "Raul",
      city: "Fort Myers",
    });
  });

  it("ignores invalid option values", () => {
    const filters = parseOfficerSearchFilters({
      certification: "Invalid Cert",
      availability: "Invalid Availability",
      experienceCategory: "Invalid Category",
      armedStatuses: "maybe",
      background: "Invalid Background",
    });

    expect(filters).toEqual({});
  });
});

describe("resolveOfficerStateQuery", () => {
  it("resolves state names and codes", () => {
    expect(resolveOfficerStateQuery("Florida")).toBe("FL");
    expect(resolveOfficerStateQuery("fl")).toBe("FL");
  });
});

describe("buildOfficerSearchWhere", () => {
  it("builds a Prisma where clause for officer search", () => {
    const where = buildOfficerSearchWhere({
      city: "Austin",
      armedStatuses: [ArmedStatus.UNARMED],
      minExperienceYears: 2,
      certification: "Taser",
      availability: "Weekends",
      experienceCategory: "Retail Security",
    });

    expect(where).toEqual({
      user: {
        role: "OFFICER",
      },
      city: {
        contains: "Austin",
        mode: "insensitive",
      },
      armedStatuses: {
        has: ArmedStatus.UNARMED,
      },
      experienceYears: {
        gte: 2,
      },
      certifications: {
        has: "Taser",
      },
      availability: {
        has: "Weekends",
      },
      experienceCategories: {
        hasSome: expect.arrayContaining(["Retail Security", "Retail security"]),
      },
    });
  });

  it("builds where clauses for name and state filters", () => {
    const where = buildOfficerSearchWhere({
      name: "Raul",
      state: "Florida",
      backgrounds: ["Military"],
      licenseTypes: ["Armed Security"],
    });

    expect(where).toMatchObject({
      OR: [
        { firstName: { contains: "Raul", mode: "insensitive" } },
        { lastName: { contains: "Raul", mode: "insensitive" } },
      ],
      state: {
        equals: "FL",
        mode: "insensitive",
      },
      licenses: {
        some: {
          licenseType: {
            in: ["Armed Security"],
          },
        },
      },
    });
  });

  it("matches profile first and last name fields", () => {
    expect(
      buildOfficerNameSearchWhere({
        firstName: "Maria",
        lastName: "Santos",
      })
    ).toEqual({
      AND: [
        { firstName: { contains: "Maria", mode: "insensitive" } },
        { lastName: { contains: "Santos", mode: "insensitive" } },
      ],
    });

    expect(
      buildOfficerSearchWhere({
        firstName: "Maria",
        lastName: "Santos",
      })
    ).toMatchObject({
      AND: [
        { firstName: { contains: "Maria", mode: "insensitive" } },
        { lastName: { contains: "Santos", mode: "insensitive" } },
      ],
    });
  });

  it("matches quick search across name and city", () => {
    expect(buildOfficerSearchWhere({ search: "Miami" })).toMatchObject({
      OR: [
        { firstName: { contains: "Miami", mode: "insensitive" } },
        { lastName: { contains: "Miami", mode: "insensitive" } },
        { city: { contains: "Miami", mode: "insensitive" } },
      ],
    });
  });
});
