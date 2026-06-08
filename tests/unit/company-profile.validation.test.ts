import { describe, expect, it } from "vitest";
import { parseCompanyPayload } from "@/app/api/company/profile/validation";

describe("parseCompanyPayload", () => {
  it("rejects whitespace-only required fields", () => {
    const result = parseCompanyPayload({
      companyName: "   ",
      contactName: "   ",
      phone: "   ",
      city: "   ",
      state: "   ",
      licenseType: "   ",
      licenseNumber: "   ",
      licenseState: "   ",
    });

    expect("errors" in result).toBe(true);

    if ("errors" in result) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "companyName", message: "companyName is required" }),
          expect.objectContaining({ field: "contactName", message: "contactName is required" }),
          expect.objectContaining({ field: "phone", message: "phone is required" }),
          expect.objectContaining({ field: "city", message: "city is required" }),
          expect.objectContaining({ field: "state", message: "state is required" }),
          expect.objectContaining({ field: "licenseType", message: "licenseType is required" }),
          expect.objectContaining({ field: "licenseNumber", message: "licenseNumber is required" }),
          expect.objectContaining({ field: "licenseState", message: "licenseState is required" }),
        ])
      );
    }
  });
});
