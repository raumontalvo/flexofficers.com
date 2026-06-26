import { describe, expect, it } from "vitest";
import {
  dashboardUserSelect,
  officerProfileSelect,
  officerWithUserSelect,
} from "@/lib/officer-fields";

describe("dashboard prisma selects", () => {
  it("uses armedStatuses instead of the removed armedStatus column", () => {
    expect(officerProfileSelect).toHaveProperty("armedStatuses", true);
    expect(officerProfileSelect).not.toHaveProperty("armedStatus");

    expect(officerWithUserSelect).toHaveProperty("armedStatuses", true);
    expect(officerWithUserSelect).not.toHaveProperty("armedStatus");

    expect(dashboardUserSelect.officer?.select).toHaveProperty(
      "armedStatuses",
      true
    );
    expect(dashboardUserSelect.officer?.select).not.toHaveProperty("armedStatus");
  });
});
