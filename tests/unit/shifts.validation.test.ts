import { describe, expect, it } from "vitest";
import { parseShiftPayload } from "@/app/api/shifts/validation";

const validPayload = {
  title: "Night Patrol",
  location: "123 Main St",
  city: "Miami",
  state: "FL",
  workType: "Gig",
  shiftTimeType: "Night Shift",
  armedRequirement: "Armed",
  requirements: ["D License", "CPR"],
  hourlyRate: 25,
  positionsNeeded: 2,
  startTime: "2026-07-01T10:00:00.000Z",
  endTime: "2026-07-01T18:00:00.000Z",
};

describe("parseShiftPayload", () => {
  it("accepts structured shift payloads", () => {
    const result = parseShiftPayload(validPayload);

    expect("errors" in result).toBe(false);

    if (!("errors" in result)) {
      expect(result.data.city).toBe("Miami");
      expect(result.data.state).toBe("FL");
      expect(result.data.workType).toBe("GIG");
      expect(result.data.shiftTimeType).toBe("NIGHT_SHIFT");
      expect(result.data.armedRequirement).toBe("ARMED");
      expect(result.data.requirements).toEqual(["D License", "CPR"]);
      expect(result.data.specialRequirements).toBe("D License, CPR");
      expect(result.data.positionsNeeded).toBe(2);
    }
  });

  it("rejects endTime that is not after startTime", () => {
    const result = parseShiftPayload({
      ...validPayload,
      startTime: "2026-07-01T10:00:00.000Z",
      endTime: "2026-07-01T09:00:00.000Z",
    });

    expect("errors" in result).toBe(true);

    if ("errors" in result) {
      expect(result.errors).toContain("endTime must be after startTime");
    }
  });

  it("requires at least one requirement chip or other text", () => {
    const result = parseShiftPayload({
      ...validPayload,
      requirements: [],
      otherRequirements: "",
    });

    expect("errors" in result).toBe(true);

    if ("errors" in result) {
      expect(result.errors).toContain("at least one requirement is required");
    }
  });
});
