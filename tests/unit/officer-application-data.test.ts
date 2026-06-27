import { describe, expect, it } from "vitest";
import {
  formatAppliedDate,
  formatApplicationsPaginationRange,
} from "@/lib/officer-application-data";

describe("officer application data helpers", () => {
  it("formats applied dates and pagination ranges", () => {
    expect(formatAppliedDate("2026-06-08T12:00:00.000Z")).toContain("2026");
    expect(formatApplicationsPaginationRange(1, 6, 6)).toBe(
      "Showing 1–6 of 6 applications"
    );
    expect(formatApplicationsPaginationRange(0, 0, 0)).toBe(
      "Showing 0 applications"
    );
  });
});
