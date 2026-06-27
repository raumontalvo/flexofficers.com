import { describe, expect, it } from "vitest";
import { parseOfficerPayload } from "@/app/api/officer/profile/validation";

const validLicense = {
  licenseNumber: "D1234567",
  licenseType: "Unarmed Security",
  issuingState: "FL",
  expirationDate: "2027-01-01",
};

const validBase = {
  firstName: "Alex",
  lastName: "Stone",
  phone: "555-0100",
  email: "alex@example.com",
  city: "Miami",
  armedStatus: "ARMED" as const,
  experienceYears: 3,
  licenses: [validLicense],
  licenseCertificationAccepted: true,
};

describe("parseOfficerPayload", () => {
  it("requires phone and email", () => {
    const result = parseOfficerPayload({
      ...validBase,
      phone: "",
      email: "",
    });

    expect("errors" in result).toBe(true);

    if ("errors" in result) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "phone", message: "phone is required" }),
          expect.objectContaining({ field: "email", message: "email is required" }),
        ])
      );
    }
  });

  it("requires at least one license", () => {
    const result = parseOfficerPayload({
      ...validBase,
      licenses: [],
    });

    expect("errors" in result).toBe(true);

    if ("errors" in result) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "licenses",
            message: "at least one license is required",
          }),
        ])
      );
    }
  });

  it("requires license certification acceptance", () => {
    const result = parseOfficerPayload({
      ...validBase,
      licenseCertificationAccepted: false,
    });

    expect("errors" in result).toBe(true);

    if ("errors" in result) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "licenseCertificationAccepted",
            message:
              "You must certify that your license information is accurate before saving.",
          }),
        ])
      );
    }
  });

  it("rejects introductions longer than 300 characters", () => {
    const result = parseOfficerPayload({
      ...validBase,
      armedStatus: "UNARMED",
      experienceYears: 2,
      introduction: "a".repeat(301),
    });

    expect("errors" in result).toBe(true);

    if ("errors" in result) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "introduction",
            message: "introduction must be 300 characters or fewer",
          }),
        ])
      );
    }
  });

  it("accepts both armed and unarmed selections", () => {
    const result = parseOfficerPayload({
      ...validBase,
      armedStatus: undefined,
      armedStatuses: ["ARMED", "UNARMED"],
      experienceYears: 5,
    });

    expect("errors" in result).toBe(false);

    if (!("errors" in result)) {
      expect(result.data.armedStatuses).toEqual(["ARMED", "UNARMED"]);
      expect(result.data.licenses).toHaveLength(1);
      expect(result.data.licenseCertificationAccepted).toBe(true);
    }
  });

  it("accepts legacy single armedStatus field", () => {
    const result = parseOfficerPayload({
      ...validBase,
    });

    expect("errors" in result).toBe(false);

    if (!("errors" in result)) {
      expect(result.data.armedStatuses).toEqual(["ARMED"]);
    }
  });

  it("requires license type for each license", () => {
    const result = parseOfficerPayload({
      ...validBase,
      licenses: [{ ...validLicense, licenseType: "" }],
    });

    expect("errors" in result).toBe(true);

    if ("errors" in result) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "licenses[0].licenseType",
            message: "licenses[0].licenseType is required",
          }),
        ])
      );
    }
  });

  it("accepts multiple licenses", () => {
    const result = parseOfficerPayload({
      ...validBase,
      armedStatus: undefined,
      armedStatuses: ["ARMED"],
      licenses: [
        validLicense,
        {
          id: "license-2",
          licenseNumber: "G7654321",
          licenseType: "Armed Security",
          issuingState: "FL",
          expirationDate: "2028-06-01",
        },
      ],
    });

    expect("errors" in result).toBe(false);

    if (!("errors" in result)) {
      expect(result.data.licenses).toHaveLength(2);
      expect(result.data.licenses[1]?.id).toBe("license-2");
    }
  });
});
