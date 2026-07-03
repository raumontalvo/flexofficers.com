import { describe, expect, it } from "vitest";
import {
  buildRecurringOccurrences,
  countRecurringOccurrences,
  emptyRecurringShiftConfig,
  formatRecurringShiftPreview,
  MAX_RECURRING_OCCURRENCES,
  parseRecurringShiftPayload,
  validateRecurringShiftForm,
} from "@/lib/recurring-shifts";

describe("recurring shifts", () => {
  const templateStart = new Date(2026, 6, 6, 9, 0, 0, 0);
  const templateEnd = new Date(2026, 6, 6, 17, 0, 0, 0);

  it("builds weekly occurrences on selected weekdays", () => {
    const occurrences = buildRecurringOccurrences(templateStart, templateEnd, {
      frequency: "WEEKLY",
      repeatDays: ["mon", "wed"],
      endType: "occurrences",
      occurrenceCount: "4",
      endDate: "",
    });

    expect(occurrences).toHaveLength(4);
    expect(occurrences[0]?.startTime.getDay()).toBe(1);
    expect(occurrences[1]?.startTime.getDay()).toBe(3);
    expect(occurrences[0]?.endTime.getHours()).toBe(17);
  });

  it("builds daily occurrences until an end date", () => {
    const occurrences = buildRecurringOccurrences(templateStart, templateEnd, {
      frequency: "DAILY",
      repeatDays: [],
      endType: "date",
      occurrenceCount: "4",
      endDate: "2026-07-08",
    });

    expect(occurrences).toHaveLength(3);
    expect(occurrences.at(-1)?.startTime.getDate()).toBe(8);
  });

  it("caps recurring schedules at 60 occurrences", () => {
    expect(
      countRecurringOccurrences(templateStart, {
        frequency: "DAILY",
        repeatDays: [],
        endType: "occurrences",
        occurrenceCount: "100",
        endDate: "",
      })
    ).toBe(MAX_RECURRING_OCCURRENCES);
  });

  it("validates recurring form requirements", () => {
    expect(
      validateRecurringShiftForm({
        startDate: "2026-07-06",
        startTime: "09:00",
        endTime: "17:00",
        locationName: "Site",
        address: "123 Main",
        city: "Miami",
        state: "FL",
        hourlyRate: "25",
        recurring: {
          ...emptyRecurringShiftConfig,
          enabled: true,
          frequency: "WEEKLY",
          repeatDays: [],
        },
      })
    ).toBe("Select at least one repeat day.");
  });

  it("parses recurring payloads for the API", () => {
    expect(
      parseRecurringShiftPayload({
        frequency: "WEEKLY",
        repeatDays: ["mon", "wed"],
        endType: "occurrences",
        occurrenceCount: 12,
      })
    ).toEqual({
      enabled: true,
      data: {
        frequency: "WEEKLY",
        repeatDays: ["mon", "wed"],
        endType: "occurrences",
        occurrenceCount: 12,
        endDate: undefined,
      },
    });
  });

  it("formats a recurring preview sentence", () => {
    const preview = formatRecurringShiftPreview(
      {
        ...emptyRecurringShiftConfig,
        enabled: true,
        frequency: "WEEKLY",
        repeatDays: ["mon", "wed"],
        endType: "occurrences",
        occurrenceCount: "12",
      },
      templateStart,
      {
        daily: "every day",
        everyDay: "every day",
        everyPrefix: "every ",
        conjunction: " and ",
        untilDate: "until {date}",
        occurrenceCount: "for {count} occurrences",
        willCreate: "This will create {count} {shiftWord}",
        shifts: "shifts",
        shift: "shift",
        weekdayLabels: {
          mon: "Monday",
          tue: "Tuesday",
          wed: "Wednesday",
          thu: "Thursday",
          fri: "Friday",
          sat: "Saturday",
          sun: "Sunday",
        },
      }
    );

    expect(preview).toBe(
      "This will create 12 shifts every Monday and Wednesday."
    );
  });
});
