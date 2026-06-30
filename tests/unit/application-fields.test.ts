import { describe, expect, it } from "vitest";
import {
  applicationIdOnlySelect,
  applicationListCoreSelect,
  companyWorkforceApplicationSelect,
  officerApplicationListSelect,
} from "@/lib/application-fields";

describe("application safe selects", () => {
  it("never selects reminder tracking columns on Application", () => {
    for (const select of [
      applicationIdOnlySelect,
      applicationListCoreSelect,
      officerApplicationListSelect,
      companyWorkforceApplicationSelect,
    ]) {
      expect("shift24HourReminderSentAt" in select).toBe(false);
      expect("shift2HourReminderSentAt" in select).toBe(false);
    }
  });

  it("never selects user.imageUrl on nested user relations", () => {
    expect(
      "imageUrl" in companyWorkforceApplicationSelect.officer.select.user.select
    ).toBe(false);
    expect(
      "imageUrl" in officerApplicationListSelect.shift.select.company.select
    ).toBe(false);
  });
});
