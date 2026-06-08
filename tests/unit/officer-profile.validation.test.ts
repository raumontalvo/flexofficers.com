import { describe, expect, it } from "vitest";
import { parseOfficerPayload } from "@/app/api/officer/profile/validation";

describe("parseOfficerPayload", () => {
  it("requires phone", () => {
    const result = parseOfficerPayload({
      firstName: "Alex",
      lastName: "Stone",
      phone: "",
      city: "Miami",
      state: "FL",
      licenses: [],
    });

    expect("errors" in result).toBe(true);

    if ("errors" in result) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "phone", message: "phone is required" }),
        ])
      );
    }
  });

  it("requires expirationDate for non-empty license entries", () => {
    const result = parseOfficerPayload({
      firstName: "Alex",
      lastName: "Stone",
      phone: "555-0100",
      city: "Miami",
      state: "FL",
      licenses: [
        {
          licenseType: "D License",
          licenseNumber: "ABC123",
          issuingState: "FL",
          expirationDate: "",
        },
      ],
    });

    expect("errors" in result).toBe(true);

    if ("errors" in result) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "licenses[0].expirationDate",
            message: "expirationDate is required",
          }),
        ])
      );
    }
  });
});
