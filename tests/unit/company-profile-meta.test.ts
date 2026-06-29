import { describe, expect, it } from "vitest";
import {
  embedCompanyProfileMeta,
  parseCompanyProfileMeta,
  stripCompanyProfileMeta,
} from "@/lib/company-profile-meta";

describe("company profile meta", () => {
  it("embeds and parses profile metadata without exposing it in the description", () => {
    const stored = embedCompanyProfileMeta("Professional security services.", {
      services: ["Armed Security"],
      officerBenefits: ["Weekly Pay"],
      workEnvironment: ["Professional"],
      businessHours: "Mon–Fri 9:00 AM – 5:00 PM",
      licenseIssueDate: "2024-01-01",
      licenseExpirationDate: "2026-01-01",
      industry: "Security Services",
      companySize: "11–50 employees",
      established: "2018",
    });

    expect(stripCompanyProfileMeta(stored)).toBe("Professional security services.");
    expect(
      stripCompanyProfileMeta(
        "Summary text [fo-meta]{\"services\":[\"Armed Security\"]}[/fo-meta] trailing"
      )
    ).toBe("Summary text  trailing");
    expect(parseCompanyProfileMeta(stored)).toEqual({
      services: ["Armed Security"],
      officerBenefits: ["Weekly Pay"],
      workEnvironment: ["Professional"],
      businessHours: "Mon–Fri 9:00 AM – 5:00 PM",
      licenseIssueDate: "2024-01-01",
      licenseExpirationDate: "2026-01-01",
      industry: "Security Services",
      companySize: "11–50 employees",
      established: "2018",
    });
  });
});
