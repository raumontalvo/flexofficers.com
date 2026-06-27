import { describe, expect, it } from "vitest";
import {
  dashboardUserSelect,
  officerProfilePageUserSelect,
  officerProfileSelect,
  officerWithUserSelect,
} from "@/lib/officer-fields";

describe("dashboard prisma selects", () => {
  it("uses armedStatuses instead of the removed armedStatus column", () => {
    expect(officerProfileSelect).toHaveProperty("armedStatuses", true);
    expect(officerProfileSelect).not.toHaveProperty("armedStatus");
    expect(officerProfileSelect).not.toHaveProperty("licenseExpirationDate");
    expect(officerProfileSelect).toHaveProperty("licenseCertificationAccepted", true);
    expect(officerProfileSelect).toHaveProperty("licenses");

    expect(officerWithUserSelect).toHaveProperty("armedStatuses", true);
    expect(officerWithUserSelect).not.toHaveProperty("armedStatus");

    expect(dashboardUserSelect.officer?.select).toHaveProperty(
      "armedStatuses",
      true
    );
    expect(dashboardUserSelect.officer?.select).not.toHaveProperty("armedStatus");
    expect(dashboardUserSelect.officer?.select).toHaveProperty("licenses");
    expect(dashboardUserSelect.officer?.select).not.toHaveProperty(
      "licenseExpirationDate"
    );
  });

  it("uses explicit select for officer profile page user query", () => {
    expect(officerProfilePageUserSelect).toHaveProperty("email", true);
    expect(officerProfilePageUserSelect.officer?.select).toBe(officerProfileSelect);
    expect(officerProfilePageUserSelect.officer?.select).not.toHaveProperty(
      "armedStatus"
    );
    expect(officerProfilePageUserSelect.officer?.select).not.toHaveProperty(
      "licenseExpirationDate"
    );
  });
});
