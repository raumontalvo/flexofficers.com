import { describe, expect, it } from "vitest";
import { parseOfficerPayload } from "@/app/api/officer/profile/validation";

describe("parseOfficerPayload", () => {
  it("requires phone and email", () => {
    const result = parseOfficerPayload({
      firstName: "Alex",
      lastName: "Stone",
      phone: "",
      email: "",
      city: "Miami",
      armedStatus: "ARMED",
      experienceYears: 3,
      licenseExpirationDate: "2027-01-01",
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

  it("rejects introductions longer than 300 characters", () => {
    const result = parseOfficerPayload({
      firstName: "Alex",
      lastName: "Stone",
      phone: "555-0100",
      email: "alex@example.com",
      city: "Miami",
      armedStatus: "UNARMED",
      experienceYears: 2,
      licenseExpirationDate: "2027-01-01",
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
      firstName: "Alex",
      lastName: "Stone",
      phone: "555-0100",
      email: "alex@example.com",
      city: "Miami",
      armedStatuses: ["ARMED", "UNARMED"],
      experienceYears: 5,
      licenseExpirationDate: "2027-01-01",
    });

    expect("errors" in result).toBe(false);

    if (!("errors" in result)) {
      expect(result.data.armedStatuses).toEqual(["ARMED", "UNARMED"]);
    }
  });

  it("accepts legacy single armedStatus field", () => {
    const result = parseOfficerPayload({
      firstName: "Alex",
      lastName: "Stone",
      phone: "555-0100",
      email: "alex@example.com",
      city: "Miami",
      armedStatus: "ARMED",
      experienceYears: 3,
      licenseExpirationDate: "2027-01-01",
    });

    expect("errors" in result).toBe(false);

    if (!("errors" in result)) {
      expect(result.data.armedStatuses).toEqual(["ARMED"]);
    }
  });
});
