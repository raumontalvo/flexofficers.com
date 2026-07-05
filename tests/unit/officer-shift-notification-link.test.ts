import { describe, expect, it } from "vitest";
import {
  appendOfficerShiftNotificationLink,
  buildOfficerMyShiftsHref,
  parseOfficerShiftNotificationLink,
  stripOfficerShiftNotificationLink,
} from "@/lib/officer-shift-notification-link";

describe("officer shift notification links", () => {
  it("builds My Shifts hrefs with tab and shift id", () => {
    expect(buildOfficerMyShiftsHref({ tab: "cancelled" })).toBe(
      "/officer/accepted-shifts?tab=cancelled"
    );
    expect(
      buildOfficerMyShiftsHref({ tab: "cancelled", shiftId: "shift-1" })
    ).toBe("/officer/accepted-shifts?tab=cancelled&shiftId=shift-1");
  });

  it("embeds and strips My Shifts links from notification messages", () => {
    const message = appendOfficerShiftNotificationLink(
      'The shift "Warehouse Security" was cancelled by the company.',
      { tab: "cancelled", shiftId: "shift-1" }
    );

    expect(parseOfficerShiftNotificationLink(message)).toBe(
      "/officer/accepted-shifts?tab=cancelled&shiftId=shift-1"
    );
    expect(stripOfficerShiftNotificationLink(message)).toBe(
      'The shift "Warehouse Security" was cancelled by the company.'
    );
  });
});
