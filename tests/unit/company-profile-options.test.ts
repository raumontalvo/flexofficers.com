import { describe, expect, it } from "vitest";
import {
  buildCompanyServices,
  COMPANY_PROFILE_SERVICES,
} from "@/lib/company-profile-options";

describe("company profile options", () => {
  it("only returns known services selected from shift requirements", () => {
    expect(
      buildCompanyServices([
        { requirements: ["Armed Security", "Custom Patrol"] },
        { requirements: ["Event Security", "Armed Security"] },
      ])
    ).toEqual(["Armed Security", "Event Security"]);
  });

  it("keeps services in the approved display order", () => {
    expect(COMPANY_PROFILE_SERVICES[0]).toBe("Armed Security");
    expect(COMPANY_PROFILE_SERVICES).toContain("24/7 Monitoring & Support");
  });
});
