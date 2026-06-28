import { describe, expect, it } from "vitest";
import { parseCompanyPayload } from "@/app/api/company/profile/validation";
import {
  buildCompanyProfileSavePayload,
  sanitizeProfileFieldValue,
} from "@/lib/company-profile-payload";
import type { CompanyProfileEditFormState } from "@/lib/company-profile-edit-data";

const validPayload = {
  companyName: "United States Security",
  tagline: "Professional Security Services",
  phone: "(239) 555-0100",
  email: "owner@uss.test",
  city: "Fort Myers",
  state: "FL",
  description: "Professional security services across Florida.",
  services: ["Armed Security"],
  officerBenefits: ["Weekly Pay"],
  workEnvironment: ["Professional"],
  licenseNumber: "B1234567",
  licenseType: "Armed Security",
  licenseState: "FL",
  licenseIssueDate: "2024-01-01",
  licenseExpirationDate: "2026-01-01",
  businessHours: "Mon–Fri 9:00 AM – 5:00 PM",
  industry: "Security Services",
  companySize: "11–50 employees",
  established: "2018",
};

const completeForm: CompanyProfileEditFormState = {
  logoUrl: "",
  companyName: "United States Security",
  tagline: "Professional Security Services",
  website: "https://example.com",
  city: "Fort Myers",
  state: "FL",
  description: "Professional security services across Florida.",
  services: ["Armed Security"],
  customServices: [],
  officerBenefits: ["Weekly Pay"],
  customBenefits: [],
  workEnvironment: ["Professional"],
  customWorkEnvironment: [],
  licenseNumber: "B1234567",
  licenseType: "Class B Security",
  licenseState: "FL",
  licenseIssueDate: "2024-01-01",
  licenseExpirationDate: "2026-01-01",
  email: "owner@uss.test",
  phone: "(239) 555-0100",
  businessHours: "Mon–Fri 9:00 AM – 5:00 PM",
  hasPublicProfile: true,
  industry: "Security Services",
  companySize: "11–50 employees",
  established: "2018",
};

describe("parseCompanyPayload", () => {
  it("accepts a complete company profile payload", () => {
    const result = parseCompanyPayload(validPayload);

    expect("errors" in result).toBe(false);

    if (!("errors" in result)) {
      expect(result.data.companyName).toBe("United States Security");
      expect(result.data.contactName).toBe("Professional Security Services");
      expect(result.data.address).toBe("Fort Myers, FL");
      expect(result.data.services).toEqual(["Armed Security"]);
    }
  });

  it("reports the sidebar fields that fail on a typical edit form submit", () => {
    const result = parseCompanyPayload({
      ...validPayload,
      licenseType: "",
      licenseIssueDate: "",
      licenseExpirationDate: "",
      businessHours: "",
    });

    expect("errors" in result).toBe(true);

    if ("errors" in result) {
      expect(result.errors.map((error) => error.field)).toEqual(
        expect.arrayContaining([
          "licenseType",
          "licenseIssueDate",
          "licenseExpirationDate",
          "businessHours",
        ])
      );
    }
  });

  it("accepts a stored license type that is not in the dropdown options", () => {
    const result = parseCompanyPayload({
      ...validPayload,
      licenseType: "Class B Security",
    });

    expect("errors" in result).toBe(false);

    if (!("errors" in result)) {
      expect(result.data.licenseType).toBe("Class B Security");
    }
  });

  it("treats none as empty for required fields", () => {
    const result = parseCompanyPayload({
      ...validPayload,
      tagline: " none ",
    });

    expect("errors" in result).toBe(true);

    if ("errors" in result) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "tagline", message: "tagline is required" }),
        ])
      );
    }
  });
});

describe("company profile payload builder", () => {
  it("builds arrays and sanitizes optional strings for the API", () => {
    const payload = buildCompanyProfileSavePayload({
      ...completeForm,
      website: " none ",
      logoUrl: "",
      customServices: ["Private Patrol"],
    });

    expect(payload.services).toEqual(["Armed Security", "Private Patrol"]);
    expect(payload.website).toBeUndefined();
    expect(payload.logoUrl).toBeUndefined();
    expect(payload.licenseType).toBe("Class B Security");
    expect(sanitizeProfileFieldValue(" none ")).toBe("");
  });
});
