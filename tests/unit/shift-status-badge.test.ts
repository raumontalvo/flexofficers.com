import { describe, expect, it } from "vitest";
import { shiftStatusVariant } from "@/components/ui/status-badge";

describe("shiftStatusVariant", () => {
  it("maps shift statuses to badge variants", () => {
    expect(shiftStatusVariant("OPEN")).toBe("success");
    expect(shiftStatusVariant("FILLED")).toBe("neutral");
    expect(shiftStatusVariant("CANCELLED")).toBe("rejected");
    expect(shiftStatusVariant("UNKNOWN")).toBe("neutral");
  });
});
