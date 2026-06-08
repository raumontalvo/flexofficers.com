import { describe, expect, it } from "vitest";
import { parseShiftPayload } from "@/app/api/shifts/validation";

describe("parseShiftPayload", () => {
  it("rejects endTime that is not after startTime", () => {
    const result = parseShiftPayload({
      title: "Night Patrol",
      location: "HQ",
      requiredLicense: "D License",
      hourlyRate: 25,
      positionsNeeded: 1,
      startTime: "2026-07-01T10:00:00.000Z",
      endTime: "2026-07-01T09:00:00.000Z",
    });

    expect("errors" in result).toBe(true);

    if ("errors" in result) {
      expect(result.errors).toContain("endTime must be after startTime");
    }
  });
});
