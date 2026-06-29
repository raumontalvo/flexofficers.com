import { describe, expect, it } from "vitest";
import {
  getShiftDetailReturnPath,
  isSafeInternalReturnPath,
  shiftDetailHref,
} from "@/lib/shift-detail-navigation";

describe("shift-detail-navigation", () => {
  it("builds shift detail href with encoded return path", () => {
    expect(shiftDetailHref("shift-1", "/officer/applications")).toBe(
      "/shifts/shift-1?from=%2Fofficer%2Fapplications"
    );
  });

  it("omits return path when unsafe", () => {
    expect(shiftDetailHref("shift-1", "https://evil.test")).toBe("/shifts/shift-1");
    expect(shiftDetailHref("shift-1", "//evil.test")).toBe("/shifts/shift-1");
    expect(shiftDetailHref("shift-1", "/shifts/other-shift")).toBe("/shifts/shift-1");
  });

  it("validates internal return paths", () => {
    expect(isSafeInternalReturnPath("/dashboard")).toBe(true);
    expect(isSafeInternalReturnPath("/shifts?city=Austin")).toBe(true);
    expect(isSafeInternalReturnPath("/shifts/abc")).toBe(false);
    expect(isSafeInternalReturnPath("//evil.test")).toBe(false);
  });

  it("reads return path from query value", () => {
    expect(getShiftDetailReturnPath("/officer/applications")).toBe(
      "/officer/applications"
    );
    expect(getShiftDetailReturnPath("/shifts/abc")).toBeNull();
  });
});
