import { describe, expect, it } from "vitest";
import { applicationStatusVariant } from "@/components/ui/status-badge";

describe("applicationStatusVariant", () => {
  it("maps application statuses to badge variants", () => {
    expect(applicationStatusVariant("ACCEPTED")).toBe("success");
    expect(applicationStatusVariant("PENDING")).toBe("pending");
    expect(applicationStatusVariant("REJECTED")).toBe("rejected");
    expect(applicationStatusVariant("WITHDRAWN")).toBe("neutral");
    expect(applicationStatusVariant("UNKNOWN")).toBe("neutral");
  });
});
