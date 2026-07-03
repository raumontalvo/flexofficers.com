import { describe, expect, it } from "vitest";
import {
  formatAcceptedShiftsPaginationRange,
  getAcceptedShiftTab,
  hasCompanyContact,
  mapOfficerAcceptedShiftApplication,
  officerAcceptedShiftListSelect,
} from "@/lib/officer-accepted-shift-data";

describe("officer accepted shift data helpers", () => {
  it("uses an explicit application select without reminder tracking columns", () => {
    expect(officerAcceptedShiftListSelect).toEqual({
      id: true,
      clockInAt: true,
      clockOutAt: true,
      clockInLatitude: true,
      clockInLongitude: true,
      clockOutLatitude: true,
      clockOutLongitude: true,
      shift: expect.any(Object),
    });
    expect("shift24HourReminderSentAt" in officerAcceptedShiftListSelect).toBe(
      false
    );
    expect("shift2HourReminderSentAt" in officerAcceptedShiftListSelect).toBe(
      false
    );
    expect(
      "imageUrl" in officerAcceptedShiftListSelect.shift.select.company.select.user.select
    ).toBe(false);
  });

  it("maps accepted shift applications for officer pages", () => {
    const mapped = mapOfficerAcceptedShiftApplication({
      id: "app-1",
      clockInAt: null,
      clockOutAt: null,
      clockInLatitude: null,
      clockInLongitude: null,
      clockOutLatitude: null,
      clockOutLongitude: null,
      shift: {
        id: "shift-1",
        title: "Warehouse Security",
        hourlyRate: { toString: () => "20" },
        location: "Tampa, FL",
        city: "Tampa",
        state: "FL",
        startTime: new Date("2099-06-11T18:00:00.000Z"),
        endTime: new Date("2099-06-12T02:00:00.000Z"),
        shiftTimeType: "NIGHT_SHIFT",
        requirements: ["CPR"],
        otherRequirements: null,
        specialRequirements: "",
        status: "OPEN",
        reportingInstructions: null,
        company: {
          companyName: "SecurePro",
          contactName: "Alex",
          phone: "555-0100",
          email: null,
          user: {
            email: "alex@example.com",
          },
        },
      },
    });

    expect(mapped.company.email).toBe("alex@example.com");
    expect(mapped.shift.hourlyRate).toBe("20");
  });

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

  it("treats clocked-out shifts as completed even before the end time", () => {
    expect(
      getAcceptedShiftTab(
        "FILLED",
        "2099-12-01T00:00:00.000Z",
        "2026-07-03T20:00:00.000Z"
      )
    ).toBe("completed");
    expect(
      getAcceptedShiftTab("FILLED", "2099-12-01T00:00:00.000Z", null)
    ).toBe("upcoming");
    expect(
      getAcceptedShiftTab(
        "CANCELLED",
        "2099-12-01T00:00:00.000Z",
        "2026-07-03T20:00:00.000Z"
      )
    ).toBe("cancelled");
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
