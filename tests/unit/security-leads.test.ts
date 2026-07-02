import { describe, expect, it } from "vitest";
import { parseSecurityLeadPayload } from "@/lib/security-lead-validation";
import { buildPublicLeadsWhere } from "@/lib/security-lead-data";

describe("security lead validation", () => {
  it("parses a valid lead payload", () => {
    const result = parseSecurityLeadPayload({
      contactName: "Alex Owner",
      email: "alex@example.com",
      phone: "2395550100",
      serviceNeeded: "Event Security",
      city: "Fort Myers",
      state: "FL",
      address: "123 Main St",
      dateNeeded: "2026-07-15",
      startTime: "2026-07-15T18:00:00.000Z",
      endTime: "2026-07-15T23:00:00.000Z",
      officersNeeded: 2,
      budgetOffer: "$800",
      description: "Need two officers for a private event.",
      urgency: "URGENT",
    });

    expect("errors" in result).toBe(false);
    if (!("errors" in result)) {
      expect(result.data.contactName).toBe("Alex Owner");
      expect(result.data.urgency).toBe("URGENT");
      expect(result.data.officersNeeded).toBe(2);
    }
  });

  it("requires core lead fields", () => {
    const result = parseSecurityLeadPayload({});

    expect("errors" in result).toBe(true);
    if ("errors" in result) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });
});

describe("public lead browse filter", () => {
  it("only exposes paid open public leads", () => {
    expect(buildPublicLeadsWhere()).toEqual({
      status: "OPEN",
      paymentStatus: "PAID",
      postType: "PUBLIC",
    });
  });
});
