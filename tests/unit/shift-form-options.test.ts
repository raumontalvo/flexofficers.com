import { describe, expect, it } from "vitest";
import { buildShiftSpecialRequirements } from "@/lib/shift-form-options";

describe("shift form options", () => {
  it("builds special requirements from chips and other text", () => {
    expect(
      buildShiftSpecialRequirements({
        requirements: ["D License", "CPR"],
        otherRequirements: "Age 21+",
      })
    ).toBe("D License, CPR, Age 21+");
  });
});
