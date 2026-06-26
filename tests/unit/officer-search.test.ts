import { describe, expect, it } from "vitest";
import { ArmedStatus } from "@/app/generated/prisma/enums";
import {
  buildOfficerSearchWhere,
  parseOfficerSearchFilters,
} from "@/lib/officer-search";

describe("parseOfficerSearchFilters", () => {
  it("parses valid filter values", () => {
    const filters = parseOfficerSearchFilters({
      city: " Miami ",
      armedStatuses: "armed",
      minExperienceYears: "3",
      certification: "CPR / First Aid",
      availability: "Night Shift",
      experienceCategory: "Hospital security",
    });

    expect(filters).toEqual({
      city: "Miami",
      armedStatuses: [ArmedStatus.ARMED],
      minExperienceYears: 3,
      certification: "CPR / First Aid",
      availability: "Night Shift",
      experienceCategory: "Hospital security",
    });
  });

  it("ignores invalid option values", () => {
    const filters = parseOfficerSearchFilters({
      certification: "Invalid Cert",
      availability: "Invalid Availability",
      experienceCategory: "Invalid Category",
      armedStatuses: "maybe",
    });

    expect(filters).toEqual({});
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
      experienceCategory: "Retail security",
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
        has: "Retail security",
      },
    });
  });
});
