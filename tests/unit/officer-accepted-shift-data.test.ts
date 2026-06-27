import { describe, expect, it } from "vitest";
import {
  formatAcceptedShiftsPaginationRange,
  getAcceptedShiftTab,
  hasCompanyContact,
} from "@/lib/officer-accepted-shift-data";

describe("officer accepted shift data helpers", () => {
  it("categorizes shifts by status and end time", () => {
    expect(getAcceptedShiftTab("CANCELLED", "2026-12-01T00:00:00.000Z")).toBe(
      "cancelled"
    );
    expect(getAcceptedShiftTab("COMPLETED", "2026-12-01T00:00:00.000Z")).toBe(
      "completed"
    );
    expect(getAcceptedShiftTab("OPEN", "2099-12-01T00:00:00.000Z")).toBe(
      "upcoming"
    );
    expect(getAcceptedShiftTab("OPEN", "2020-01-01T00:00:00.000Z")).toBe(
      "completed"
    );
  });

  it("formats pagination and detects company contact", () => {
    expect(formatAcceptedShiftsPaginationRange(1, 10, 12)).toBe(
      "Showing 1–10 of 12 accepted shifts"
    );
    expect(
      hasCompanyContact({
        companyName: "SecurePro",
        contactName: "Alex",
        phone: null,
        email: "",
      })
    ).toBe(true);
    expect(
      hasCompanyContact({
        companyName: "SecurePro",
        contactName: null,
        phone: null,
        email: "",
      })
    ).toBe(false);
  });
});
